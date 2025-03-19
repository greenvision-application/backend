import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  async create(createNotificationDto: CreateNotificationDto) {
    try {
      return await this.prisma.notification.create({
        data: {
          content: createNotificationDto.content,
          send_time: createNotificationDto.send_time,
          status: createNotificationDto.status,
          user_id: createNotificationDto.user_id,
        },
      });
    } catch (error) {
      throw new Error(error.message || 'Failed to create notification');
    }
  }

  async findAll() {
    try {
      return await this.prisma.notification.findMany();
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch notifications');
    }
  }

  async findOne(id: string) {
    try {
      const notification = await this.prisma.notification.findUnique({
        where: { id },
        include: {
          User: true,
        },
      });

      if (!notification) {
        throw new NotFoundException(`Notification with ID ${id} not found`);
      }

      return notification;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Failed to fetch notification');
    }
  }

  async update(id: string, updateNotificationDto: UpdateNotificationDto) {
    try {
      const notification = await this.prisma.notification.findUnique({
        where: { id },
      });

      if (!notification) {
        throw new NotFoundException(`Notification with ID ${id} not found`);
      }

      return await this.prisma.notification.update({
        where: { id },
        data: {
          content: updateNotificationDto.content,
          send_time: updateNotificationDto.send_time,
          status: updateNotificationDto.status,
          user_id: updateNotificationDto.user_id,
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Failed to update notification');
    }
  }

  async remove(id: string) {
    try {
      const notification = await this.prisma.notification.findUnique({
        where: { id },
      });

      if (!notification) {
        throw new NotFoundException(`Notification with ID ${id} not found`);
      }

      return await this.prisma.notification.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Failed to delete notification');
    }
  }
}
