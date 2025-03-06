import { Module } from '@nestjs/common';
import { CareScheduleService } from './care_schedule.service';
import { CareScheduleController } from './care_schedule.controller';
import { PrismaService } from '@/prisma/prisma.service';
import { GeminiService } from '@/gemini/gemini.service';
import { UserPlantService } from '@/user_plant/user_plant.service';
import { TasksService } from '@/tasks/tasks.service';

@Module({
  controllers: [CareScheduleController],
  providers: [
    CareScheduleService,
    PrismaService,
    GeminiService,
    UserPlantService,
    TasksService,
  ],
})
export class CareScheduleModule {}
