import { Module } from '@nestjs/common';
import { PhaseService } from './phase.service';
import { PhaseController } from './phase.controller';
import { PrismaService } from '@/prisma/prisma.service';

@Module({
  controllers: [PhaseController],
  providers: [PhaseService, PrismaService],
  exports: [PhaseService],
})
export class PhaseModule {}
