import { Injectable, Logger } from '@nestjs/common';
import {
  GoogleGenerativeAI,
  GenerativeModel,
  ChatSession,
} from '@google/generative-ai';
import { GoogleAIFileManager } from '@google/generative-ai/server';
import { ConfigService } from '@nestjs/config';
import gemini from 'constants/gemini';
import { v4 } from 'uuid';
import { GetAIMessageDTO } from './dto/get-ai-response.dto';

@Injectable()
export class GeminiService {
  private readonly googleAI: GoogleGenerativeAI;
  private readonly model: GenerativeModel;
  private readonly fileManager: GoogleAIFileManager;
  private chatSessions: { [sessionId: string]: ChatSession } = {};
  private readonly logger = new Logger(GeminiService.name);

  constructor(configService: ConfigService) {
    const geminiApiKey = configService.get('GEMINI_API_KEY');
    this.googleAI = new GoogleGenerativeAI(geminiApiKey);
    this.fileManager = new GoogleAIFileManager(geminiApiKey);
    this.model = this.googleAI.getGenerativeModel({
      model: gemini.GEMINI_MODEL_NAME,
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

  async analyzeImageUrl(data: GetAIMessageDTO) {
    try {
      if (!data.imageUrl) {
        throw new Error('Image URL is required');
      }

      const imageResp = await fetch(data.imageUrl);
      if (!imageResp.ok) {
        throw new Error('Failed to fetch image');
      }
      const imageBuffer = await imageResp.arrayBuffer();

      const result = await this.model.generateContent([
        {
          inlineData: {
            data: Buffer.from(imageBuffer).toString('base64'),
            mimeType: 'image/jpeg',
          },
        },
        data.prompt,
      ]);

      return {
        result: await result.response.text(),
      };
    } catch (error) {
      this.logger.error('Error analyzing image:', error);
    }
  }

  async uploadImage(file: Express.Multer.File) {
    console.log(file);
    console.log(file.path);

    try {
      const uploadResult = await this.fileManager.uploadFile(file.path, {
        mimeType: file.mimetype,
        displayName: file.originalname,
      });

      this.logger.log(
        `Uploaded file ${uploadResult.file.displayName} as: ${uploadResult.file.uri}`,
      );

      return {
        fileUri: uploadResult.file.uri,
        mimeType: uploadResult.file.mimeType,
      };
    } catch (error) {
      this.logger.error('Error uploading image:', error);
      throw new Error('Failed to upload image');
    }
  }

  async analyzeUploadedFile(fileUri: string) {
    try {
      const result = await this.model.generateContent([
        'Tell me about this image.',
        {
          fileData: {
            fileUri,
            mimeType: 'image/jpeg',
          },
        },
      ]);

      return {
        result: await result.response.text(),
      };
    } catch (error) {
      this.logger.error('Error analyzing uploaded image:', error);
      throw new Error('Failed to analyze image');
    }
  }
}
