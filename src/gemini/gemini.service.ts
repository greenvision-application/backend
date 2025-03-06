import { Injectable, Logger } from '@nestjs/common';
import {
  GoogleGenerativeAI,
  GenerativeModel,
  ChatSession,
  GenerateContentResult,
} from '@google/generative-ai';
import { GoogleAIFileManager } from '@google/generative-ai/server';
import { ConfigService } from '@nestjs/config';
import { v4 } from 'uuid';
import { createApi } from 'unsplash-js';
import { GetAIMessageDTO } from './dto/get-ai-response.dto';
import { GetAIScanResultDTO } from './dto/get-scan-result.dto';
import gemini from 'constants/gemini';
import keys from 'constants/keys';
import promptToScan from 'constants/prompts/to-scan';
import promptToGeneratePhasePlant from 'constants/prompts/to-generate-phases';
import promptToGenerateSchedule from 'constants/prompts/to-generate-schedule';
import { PlantResponseDTO } from './dto/ai-scan-plant-response.dto';
import { PlantGrowthPhaseDTO } from './dto/plant-growth-phase.dto';
import { CareScheduleDto } from './dto/care-schedule.dto';

@Injectable()
export class GeminiService {
  private readonly googleAI: GoogleGenerativeAI;
  private readonly modelGeneral: GenerativeModel;
  private readonly modelImageAnalysis: GenerativeModel;
  private readonly modelPhaseGeneration: GenerativeModel;
  private readonly modelScheduleGeneration: GenerativeModel;
  private readonly fileManager: GoogleAIFileManager;
  private chatSessions: { [sessionId: string]: ChatSession } = {};
  private readonly logger = new Logger(GeminiService.name);
  private readonly unsplash;

  constructor(configService: ConfigService) {
    const geminiApiKey = configService.get(keys.geminiKey);
    const unsplashAccessKey = configService.get(keys.unsplashAccessKey);
    this.googleAI = new GoogleGenerativeAI(geminiApiKey);
    this.fileManager = new GoogleAIFileManager(geminiApiKey);
    this.modelGeneral = this.googleAI.getGenerativeModel({
      model: gemini.GEMINI_MODEL_NAME,
      generationConfig: gemini.generalConfig,
    });
    this.modelImageAnalysis = this.googleAI.getGenerativeModel({
      model: gemini.GEMINI_MODEL_NAME,
      generationConfig: gemini.imageAnalysisConfig,
    });
    this.modelPhaseGeneration = this.googleAI.getGenerativeModel({
      model: gemini.GEMINI_MODEL_NAME,
      generationConfig: gemini.phaseGenerationConfig,
    });
    this.modelScheduleGeneration = this.googleAI.getGenerativeModel({
      model: gemini.GEMINI_MODEL_NAME,
      generationConfig: gemini.scheduleGenerationConfig,
    });
    this.unsplash = createApi({ accessKey: unsplashAccessKey });
  }

  private getChatSession(sessionId?: string) {
    const sessionIdToUse = sessionId ?? v4();
    let result = this.chatSessions[sessionIdToUse];

    if (!result) {
      result = this.modelGeneral.startChat();
    }

    return {
      sessionId: sessionIdToUse,
      chat: result,
    };
  }

  private simplifyUrl = (url: string): string => {
    const match = url.match(/photo-[\w\d-]+/);
    return match ? `https://images.unsplash.com/${match[0]}?w=400` : url;
  };

  private async getUnsplashImage(query: string): Promise<string[] | null> {
    try {
      const response = await this.unsplash.search.getPhotos({
        query,
        perPage: 5,
        orientation: 'landscape',
      });

      if (!response.response || !response.response.results.length) {
        this.logger.log(`No images found for query: ${query}`);
        return null;
      }

      const result = response.response.results.map((image) =>
        this.simplifyUrl(image.urls.small),
      );

      return result;
    } catch (error) {
      this.logger.error(`Failed to fetch Unsplash images for ${query}:`, error);
      return null;
    }
  }

  async generateText(data: GetAIMessageDTO) {
    try {
      const { sessionId, chat } = this.getChatSession(data.sessionId);
      const result = await chat.sendMessage(data.prompt.toString());

      return {
        result: result.response.text(),
        sessionId,
      };
    } catch (error) {
      this.logger.error('Error sending message to Gemini API :', error);
    }
  }

  private async processAIResponse<T>(
    result: GenerateContentResult,
  ): Promise<T> {
    const rawText = result.response?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) {
      throw new Error('No valid response from Gemini AI model');
    }
    return JSON.parse(rawText) as T;
  }

  async analyzeImageUrl(data: GetAIScanResultDTO): Promise<PlantResponseDTO> {
    try {
      if (!data.imageUrl) {
        throw new Error('Image URL is required');
      }

      const imageResp = await fetch(data.imageUrl);
      if (!imageResp.ok) {
        throw new Error('Failed to fetch image');
      }
      const imageBuffer = await imageResp.arrayBuffer();
      const contentType = imageResp.headers.get('content-type');

      if (!gemini.validMimeTypes.includes(contentType)) {
        throw new Error(
          'Unsupported image format. Please use PNG, JPEG, WebP, HEIC or HEIF format',
        );
      }

      const result = await this.modelImageAnalysis.generateContent([
        {
          inlineData: {
            data: Buffer.from(imageBuffer).toString('base64'),
            mimeType: contentType,
          },
        },
        promptToScan.promptToScanEn,
      ]);

      const processedResult =
        await this.processAIResponse<PlantResponseDTO>(result);

      const { scientific_name, plant_name, searchQuery } = processedResult;
      const searchQueryKey = searchQuery || scientific_name || plant_name;
      const unsplashImages = await this.getUnsplashImage(searchQueryKey);

      return { ...processedResult, image_url: unsplashImages };
    } catch (error) {
      this.logger.error('Error analyzing image:', error);
    }
  }

  async analyzeUploadedFile(
    fileUri: string,
    mimeType: string,
  ): Promise<PlantResponseDTO> {
    try {
      const result = await this.modelImageAnalysis.generateContent([
        {
          fileData: {
            fileUri,
            mimeType: mimeType,
          },
        },
        promptToScan.promptToScanEn,
      ]);

      const processedResult =
        await this.processAIResponse<PlantResponseDTO>(result);

      const { scientific_name, plant_name, searchQuery } = processedResult;
      const searchQueryKey = searchQuery || scientific_name || plant_name;
      const unsplashImages = await this.getUnsplashImage(searchQueryKey);

      return { ...processedResult, image_url: unsplashImages };
    } catch (error) {
      this.logger.error('Error analyzing uploaded image:', error);
      throw new Error('Failed to analyze image');
    }
  }

  async generatePhaseOfPlant(
    plant_name: string,
    scientificName: string,
  ): Promise<PlantGrowthPhaseDTO[]> {
    try {
      const handlePrompt = promptToGeneratePhasePlant.promptToGeneratePhaseEn(
        plant_name,
        scientificName,
      );
      const geminiResult =
        await this.modelPhaseGeneration.generateContent(handlePrompt);
      const processAIResponse =
        await this.processAIResponse<PlantGrowthPhaseDTO[]>(geminiResult);
      return processAIResponse;
    } catch (error) {
      this.logger.error('Error generate phases for plant :', error);
    }
  }

  async generateScheduleTakeCarePlant(
    getUserPlantData: any,
  ): Promise<CareScheduleDto[]> {
    try {
      const handlePrompt =
        promptToGenerateSchedule.promptToGenerateCareScheduleVi(
          getUserPlantData,
        );
      const geminiResult =
        await this.modelScheduleGeneration.generateContent(handlePrompt);
      const processAIResponse =
        await this.processAIResponse<CareScheduleDto[]>(geminiResult);
      return processAIResponse;
    } catch (error) {
      this.logger.error('Error generate schedule for plant :', error);
    }
  }
}
