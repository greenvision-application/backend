import { Injectable } from '@nestjs/common';
import * as cron from 'node-cron';
import { PrismaService } from '../prisma/prisma.service';
import { Expo, ExpoPushMessage } from 'expo-server-sdk';
import { NOTIFICATION_STATUS, TASK_STATUS } from '@prisma/client';

@Injectable()
export class TaskNotificationService {
  private expo = new Expo();

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
          completion_status: TASK_STATUS.NOT_YET,
          task_date: {
            gte: now,
            lte: new Date(now.getTime() + 2 * 60 * 60 * 1000), // Task trong 2 giờ tới
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

      // Nhóm các task theo user để gửi thông báo hiệu quả hơn
      const userTaskMap = new Map();

      for (const task of upcomingTasks) {
        const user = task.Care_Schedule?.User_Plant?.User;
        if (!user || !user.pushToken) continue;

        if (!userTaskMap.has(user.id)) {
          userTaskMap.set(user.id, {
            user,
            tasks: [],
          });
        }

        userTaskMap.get(user.id).tasks.push(task);
      }

      // Xử lý gửi thông báo cho từng user
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
    if (!user.pushToken) return;

    // Nếu có nhiều task, gộp lại thành một thông báo
    if (tasks.length > 1) {
      const title = `Bạn có ${tasks.length} nhiệm vụ chăm sóc cây sắp đến hạn`;
      const message = `Hãy kiểm tra ứng dụng để xem chi tiết.`;

      // Gửi thông báo và lưu vào DB
      await this.sendAndSaveNotification(
        user.id,
        user.pushToken,
        title,
        message,
      );
    } else if (tasks.length === 1) {
      const task = tasks[0];
      const plant = task.Care_Schedule?.User_Plant;
      const plantName = plant?.nickname || plant?.Plant?.plant_name || 'cây';
      const phaseName = task.Care_Schedule?.phase_name || '';

      const title = `Nhiệm vụ chăm sóc ${plantName}${phaseName ? ` - ${phaseName}` : ''}`;
      const message = task.content;

      // Gửi thông báo và lưu vào DB
      await this.sendAndSaveNotification(
        user.id,
        user.pushToken,
        title,
        message,
      );
    }
  }

  /**
   * Gửi thông báo và lưu vào database
   */
  private async sendAndSaveNotification(
    userId: string,
    pushToken: string,
    title: string,
    message: string,
  ) {
    try {
      // Kiểm tra token hợp lệ
      if (!Expo.isExpoPushToken(pushToken)) {
        console.log(`Push token ${pushToken} is not valid`);
        return;
      }

      // Tạo notification trong DB trước
      const notification = await this.prisma.notification.create({
        data: {
          content: `${title}: ${message}`,
          send_time: new Date(),
          status: NOTIFICATION_STATUS.PENDING,
          user_id: userId,
        },
      });

      // Chuẩn bị và gửi thông báo
      const pushMessage: ExpoPushMessage = {
        to: pushToken,
        sound: 'default',
        title: title,
        body: message,
        data: { notificationId: notification.id },
      };

      // Gửi thông báo
      const ticket = await this.expo.sendPushNotificationsAsync([pushMessage]);

      // Cập nhật trạng thái sau khi gửi
      if (ticket[0]?.status === 'ok') {
        await this.prisma.notification.update({
          where: { id: notification.id },
          data: { status: NOTIFICATION_STATUS.SENT },
        });
      } else {
        await this.prisma.notification.update({
          where: { id: notification.id },
          data: { status: NOTIFICATION_STATUS.FAILED },
        });
        console.error('Failed to send notification:', ticket[0]?.message);
      }

      return notification;
    } catch (error) {
      console.error('Error sending notification:', error);

      //   // Cập nhật trạng thái thông báo nếu xảy ra lỗi
      //   await this.prisma.notification
      //     .update({
      //       where: { id: notification?.id },
      //       data: { status: NOTIFICATION_STATUS.FAILED },
      //     })
      //     .catch((e) => console.error('Error updating notification status:', e));
    }
  }
}
