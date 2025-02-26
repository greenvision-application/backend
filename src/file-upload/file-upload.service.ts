import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { GoogleAIFileManager } from '@google/generative-ai/server';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class FileUploadService {
  private readonly logger = new Logger(FileUploadService.name);
  private readonly fileManager: GoogleAIFileManager;
  private readonly supabase: SupabaseClient;
  private readonly bucketName: string;

  constructor(configService: ConfigService) {
    const geminiApiKey = configService.get('GEMINI_API_KEY');
    this.fileManager = new GoogleAIFileManager(geminiApiKey);
    const supabaseUrl = configService.get('SUPABASE_URL');
    const supabaseKey = configService.get('SUPABASE_ANON_KEY');
    this.bucketName = configService.get('SUPABASE_STORAGE_BUCKET');

    if (!supabaseUrl || !supabaseKey) {
      throw new BadRequestException('Supabase credentials are missing');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async handleFileUploadToGoogle(file: Express.Multer.File) {
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

  async handleFileUploadToSupabase(file: Express.Multer.File) {
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
      const filePath = `${Date.now()}-${file.originalname}`;

      // Upload file lên Supabase
      const { error } = await this.supabase.storage
        .from(this.bucketName)
        .upload(filePath, file.buffer, { contentType: file.mimetype });

      if (error) {
        throw new Error(`Upload failed: ${error.message}`);
      }

      // Lấy public URL của file
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
