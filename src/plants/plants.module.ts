import { Module } from '@nestjs/common';
import { PlantsService } from './plants.service';
import { PlantsController } from './plants.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { GeminiModule } from '@/gemini/gemini.module';
import { GeminiService } from '@/gemini/gemini.service';
import { PhaseService } from '@/phase/phase.service';
import { CareInstructionService } from '@/care_instruction/care_instruction.service';

@Module({
  controllers: [PlantsController],
  providers: [
    PlantsService,
    GeminiService,
    PhaseService,
    CareInstructionService,
  ],
  imports: [PrismaModule, GeminiModule],
})
export class PlantsModule {}
