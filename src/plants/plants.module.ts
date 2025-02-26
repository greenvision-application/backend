import { Module } from '@nestjs/common';
import { PlantsService } from './plants.service';
import { PlantsController } from './plants.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { GeminiModule } from '@/gemini/gemini.module';
import { GeminiService } from '@/gemini/gemini.service';

@Module({
  controllers: [PlantsController],
  providers: [PlantsService, GeminiService],
  imports: [PrismaModule, GeminiModule],
})
export class PlantsModule {}
