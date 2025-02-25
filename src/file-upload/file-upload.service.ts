import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { GoogleAIFileManager } from '@google/generative-ai/server';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FileUploadService {
  private readonly logger = new Logger(FileUploadService.name);
  private readonly fileManager: GoogleAIFileManager;

  constructor(configService: ConfigService) {
    const geminiApiKey = configService.get('GEMINI_API_KEY');
    this.fileManager = new GoogleAIFileManager(geminiApiKey);
  }

  async handleFileUpload(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('no file uploaded');
    }

    // validate file type
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/heic',
      'image/heif',
    ];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('invalid file type');
    }

    // validate file size (e.g., max 5mb)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException('file is too large!');
    }

    try {
      console.log('File uploading:', file);
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

    // return {
    //   message: 'File uploaded successfully',
    //   filePath: file.path,
    //   fileMimeType: file.mimetype,
    //   fileName: file.originalname,
    // };
  }
}
