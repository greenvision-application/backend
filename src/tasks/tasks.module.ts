import { forwardRef, Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { GeminiService } from '@/gemini/gemini.service';
import { CareScheduleService } from '@/care_schedule/care_schedule.service';
import { UserPlantService } from '@/user_plant/user_plant.service';
import { CareScheduleModule } from '@/care_schedule/care_schedule.module';
import { TaskNotificationService } from './task-notification.service';

@Module({
  controllers: [TasksController],
  providers: [
    TasksService,
    GeminiService,
    CareScheduleService,
    UserPlantService,
    TaskNotificationService,
  ],
  imports: [PrismaModule, forwardRef(() => CareScheduleModule)],
  exports: [TasksService],
})
export class TasksModule {}
