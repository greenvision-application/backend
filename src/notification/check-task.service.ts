import { Injectable } from '@nestjs/common';
import * as cron from 'node-cron';
import { PrismaService } from '../prisma/prisma.service';
import { NOTIFICATION_STATUS, TASK_STATUS } from '@prisma/client';

@Injectable()
export class TaskNotificationService {
  constructor(private prisma: PrismaService) {
    // Khởi tạo các scheduled jobs
    this.scheduleTaskNotifications();
  }

  /**
   * Thiết lập các scheduled jobs
   */
  private scheduleTaskNotifications() {
    // Kiểm tra task sắp đến hạn mỗi 30 phút
    cron.schedule('*/30 * * * *', () => {
      this.checkUpcomingTasks();
    });

    // Chạy kiểm tra một lần khi service được khởi tạo
    this.checkUpcomingTasks();
  }

  /**
   * Kiểm tra và xử lý các task sắp đến hạn
   */
  async checkUpcomingTasks() {
    try {
      console.log('Checking for upcoming tasks...');

      const now = new Date();

      // Lấy các task sắp đến hạn trong 2 giờ tới và chưa hoàn thành
      const upcomingTasks = await this.prisma.task.findMany({
        where: {
          completion_status: TASK_STATUS.DO,
          task_date: {
            gte: now,
            lte: new Date(now.getTime() + 4 * 60 * 60 * 1000), // Task trong 4 giờ tới
          },
        },
        include: {
          Care_Schedule: {
            include: {
              User_Plant: {
                include: {
                  User: true,
                  Plant: true,
                },
              },
            },
          },
        },
      });

      console.log(`Found ${upcomingTasks.length} upcoming tasks`);

      // Nhóm các task theo user để tạo thông báo hiệu quả hơn
      const userTaskMap = new Map();

      for (const task of upcomingTasks) {
        const user = task.Care_Schedule?.User_Plant?.User;
        if (!user) continue;

        if (!userTaskMap.has(user.id)) {
          userTaskMap.set(user.id, {
            user,
            tasks: [],
          });
        }

        userTaskMap.get(user.id).tasks.push(task);
      }

      // Xử lý tạo thông báo cho từng user
      for (const { user, tasks } of userTaskMap.values()) {
        await this.processUserTasks(user, tasks);
      }
    } catch (error) {
      console.error('Error checking upcoming tasks:', error);
    }
  }

  /**
   * Xử lý các task của một user
   */
  private async processUserTasks(user, tasks) {
    // Nếu có nhiều task, gộp lại thành một thông báo
    if (tasks.length > 1) {
      const title = `Bạn có ${tasks.length} nhiệm vụ chăm sóc cây sắp đến hạn`;
      const message = `Hãy kiểm tra ứng dụng để xem chi tiết.`;

      // Tạo thông báo trong DB
      await this.createNotification(
        user.id,
        `${title}: ${message}`,
        tasks[0].Care_Schedule?.id,
      );
    } else if (tasks.length === 1) {
      const task = tasks[0];
      const plant = task.Care_Schedule?.User_Plant;
      const plantName = plant?.nickname || plant?.Plant?.plant_name || 'cây';
      const phaseName = task.Care_Schedule?.phase_name || '';

      const title = `Nhiệm vụ chăm sóc ${plantName}${phaseName ? ` - ${phaseName}` : ''}`;
      const message = task.content;

      // Tạo thông báo trong DB
      await this.createNotification(
        user.id,
        `${title}: ${message}`,
        task.Care_Schedule?.id,
      );
    }
  }

  /**
   * Tạo thông báo trong database
   */
  private async createNotification(
    userId: string,
    content: string,
    scheduleId?: string,
  ) {
    try {
      // Tạo notification trong DB
      const notification = await this.prisma.notification.create({
        data: {
          content: content,
          send_time: new Date(),
          status: NOTIFICATION_STATUS.SENT, // Đánh dấu là đã gửi vì không dùng push notification
          user_id: userId,
          schedule_id: scheduleId,
        },
      });

      console.log(`Created notification: ${notification.id}`);
      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  }
}
