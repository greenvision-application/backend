import { Module } from '@nestjs/common';
import { PlantsService } from './plants.service';
import { PlantsController } from './plants.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { GeminiModule } from '@/gemini/gemini.module';
import { GeminiService } from '@/gemini/gemini.service';
import { PhaseService } from '@/phase/phase.service';
import { CareInstructionService } from '@/care_instruction/care_instruction.service';
import { PlantRecommendationService } from './plant-recommendation.service';
import { FileUploadModule } from '@/file-upload/file-upload.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Module({
  controllers: [PlantsController],
  providers: [
    PlantsService,
    GeminiService,
    PhaseService,
    CareInstructionService,
    PlantRecommendationService,
  ],
  imports: [
    PrismaModule,
    GeminiModule,
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
})
export class PlantsModule {}
