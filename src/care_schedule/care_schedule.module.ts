import { Module } from '@nestjs/common';
import { CareScheduleService } from './care_schedule.service';
import { CareScheduleController } from './care_schedule.controller';
import { PrismaService } from '@/prisma/prisma.service';

@Module({
  controllers: [CareScheduleController],
  providers: [CareScheduleService, PrismaService],
})
export class CareScheduleModule {}
