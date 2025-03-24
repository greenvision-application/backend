import { Module } from '@nestjs/common';
import { CareInstructionService } from './care_instruction.service';
import { CareInstructionController } from './care_instruction.controller';
import { PrismaService } from '@/prisma/prisma.service';

@Module({
  controllers: [CareInstructionController],
  providers: [CareInstructionService, PrismaService],
})
export class CareInstructionModule {}
