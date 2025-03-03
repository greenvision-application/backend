import { Module } from '@nestjs/common';
import { GeminiService } from './gemini.service';
import { GeminiController } from './gemini.controller';
import { FileUploadModule } from '@/file-upload/file-upload.module';
import { FileUploadService } from '@/file-upload/file-upload.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Module({
  imports: [
    FileUploadModule,
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const filename = `${Date.now()}-${file.originalname}`;
          cb(null, filename);
        },
      }),
    }),
  ],
  controllers: [GeminiController],
  providers: [GeminiService, FileUploadService],
  exports: [GeminiService],
})
export class GeminiModule {}
