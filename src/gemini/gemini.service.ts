import { Injectable, Logger } from '@nestjs/common';
import {
  GoogleGenerativeAI,
  GenerativeModel,
  ChatSession,
} from '@google/generative-ai';
import { GoogleAIFileManager } from '@google/generative-ai/server';
import { ConfigService } from '@nestjs/config';
import { v4 } from 'uuid';
import gemini from 'constants/gemini';
import keys from 'constants/keys';
import { GetAIMessageDTO } from './dto/get-ai-response.dto';

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
        data.prompt,
      ]);

      return {
        result: result.response.text(),
      };
    } catch (error) {
      this.logger.error('Error analyzing image:', error);
    }
  }
  async analyzeUploadedFile(fileUri: string, mimeType: string) {
    try {
      const result = await this.model.generateContent([
        'Miêu tả ảnh này bằng tiếng việt cho tôi.',
        {
          fileData: {
            fileUri,
            mimeType: mimeType,
          },
        },
      ]);

      return {
        result: result.response.text(),
      };
    } catch (error) {
      this.logger.error('Error analyzing uploaded image:', error);
      throw new Error('Failed to analyze image');
    }
  }
}
