import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { GoogleAIFileManager } from '@google/generative-ai/server';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import gemini from 'constants/gemini';
import keys from 'constants/keys';

@Injectable()
export class FileUploadService {
  private readonly logger = new Logger(FileUploadService.name);
  private readonly fileManager: GoogleAIFileManager;
  private readonly supabase: SupabaseClient;
  private readonly bucketName: string;

  constructor(configService: ConfigService) {
    const geminiApiKey = configService.get(keys.geminiKey);
    this.fileManager = new GoogleAIFileManager(geminiApiKey);
    const supabaseUrl = configService.get(keys.supabaseUrl);
    const supabaseKey = configService.get(keys.supabaseAnonKey);
    this.bucketName = configService.get(keys.storageBucket);

    if (!supabaseUrl || !supabaseKey) {
      throw new BadRequestException('Supabase credentials are missing');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  private validateFile(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('no file uploaded');
    }

    if (!gemini.validMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('invalid file type');
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException('file is too large!');
    }
  }

  async handleFileUploadToGoogle(file: Express.Multer.File) {
    this.validateFile(file);
    const filePath = file.path;
    try {
      const uploadResult = await this.fileManager.uploadFile(file.path, {
        mimeType: file.mimetype,
        displayName: file.originalname,
      });

      this.logger.log(
        `Uploaded file ${uploadResult.file.displayName} as: ${uploadResult.file.uri}`,
      );

      fs.unlink(filePath, (err) => {
        if (err) {
          this.logger.error(`Error deleting file: ${filePath}`, err);
        } else {
          this.logger.log(`Deleted local file: ${filePath}`);
        }
      });

      return {
        fileUri: uploadResult.file.uri,
        mimeType: uploadResult.file.mimeType,
      };
    } catch (error) {
      this.logger.error('Error uploading image:', error);
      throw new Error('Failed to upload image');
    }
  }

  async handleFileUploadToSupabase(file: Express.Multer.File) {
    this.validateFile(file);

    try {
      const filePath = `${Date.now()}-${file.originalname}`;

      const { error } = await this.supabase.storage
        .from(this.bucketName)
        .upload(filePath, file.buffer, { contentType: file.mimetype });

      if (error) {
        throw new Error(`Upload failed: ${error.message}`);
      }

      const { data: publicUrlData } = this.supabase.storage
        .from(this.bucketName)
        .getPublicUrl(filePath);

      return { filePath, url: publicUrlData.publicUrl };
    } catch (error) {
      this.logger.error(`File upload failed: ${error.message}`);
      throw error;
    }
  }
}
