import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { PrismaService } from '@/prisma/prisma.service';
import { TaskNotificationService } from './check-task.service';

@Module({
  controllers: [NotificationController],
  providers: [NotificationService, PrismaService, TaskNotificationService],
})
export class NotificationModule {}
