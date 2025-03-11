import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { GeminiService } from '@/gemini/gemini.service';
import { CareScheduleService } from '@/care_schedule/care_schedule.service';
import { UserPlantService } from '@/user_plant/user_plant.service';

@Module({
  controllers: [TasksController],
  providers: [
    TasksService,
    GeminiService,
    CareScheduleService,
    UserPlantService,
  ],
  imports: [PrismaModule],
  exports: [TasksService],
})
export class TasksModule {}
