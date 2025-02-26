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
import { GetAIMessageDTO } from './dto/get-ai-response.dto';
import { GetAIScanResultDTO } from './dto/get-scan-result.dto';
import gemini from 'constants/gemini';
import keys from 'constants/keys';
import systemPrompt from 'constants/prompts/to-scan';
import { PlantResponseDTO } from './dto/ai-scan-plant-response.dto';

@Injectable()
export class GeminiService {
  private readonly googleAI: GoogleGenerativeAI;
  private readonly model: GenerativeModel;
  private readonly fileManager: GoogleAIFileManager;
  private chatSessions: { [sessionId: string]: ChatSession } = {};
  private readonly logger = new Logger(GeminiService.name);

  constructor(configService: ConfigService) {
    const geminiApiKey = configService.get(keys.geminiKey);
    this.googleAI = new GoogleGenerativeAI(geminiApiKey);
    this.fileManager = new GoogleAIFileManager(geminiApiKey);
    this.model = this.googleAI.getGenerativeModel({
      model: gemini.GEMINI_MODEL_NAME,
      generationConfig: gemini.generationConfig,
    });
  }

  private getChatSession(sessionId?: string) {
    const sessionIdToUse = sessionId ?? v4();
    let result = this.chatSessions[sessionIdToUse];

    if (!result) {
      result = this.model.startChat();
    }

    return {
      sessionId: sessionIdToUse,
      chat: result,
    };
  }

  async generateText(data: GetAIMessageDTO) {
    try {
      const { sessionId, chat } = this.getChatSession(data.sessionId);
      const result = await chat.sendMessage(data.prompt.toString());

      return {
        result: await result.response.text(),
        sessionId,
      };
    } catch (error) {
      this.logger.error('Error sending message to Gemini API :', error);
    }
  }

  private async processAIResponse(
    result: GenerateContentResult,
  ): Promise<PlantResponseDTO> {
    const rawText = result.response?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) {
      throw new Error('No valid response from Gemini AI model');
    }
    return JSON.parse(rawText);
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

      const result = await this.model.generateContent([
        {
          inlineData: {
            data: Buffer.from(imageBuffer).toString('base64'),
            mimeType: contentType,
          },
        },
        systemPrompt.promptToScanEn,
      ]);

      return await this.processAIResponse(result);
    } catch (error) {
      this.logger.error('Error analyzing image:', error);
    }
  }

  async analyzeUploadedFile(
    fileUri: string,
    mimeType: string,
  ): Promise<PlantResponseDTO> {
    try {
      const result = await this.model.generateContent([
        {
          fileData: {
            fileUri,
            mimeType: mimeType,
          },
        },
        systemPrompt.promptToScanEn,
      ]);

      return await this.processAIResponse(result);
    } catch (error) {
      this.logger.error('Error analyzing uploaded image:', error);
      throw new Error('Failed to analyze image');
    }
  }
}
