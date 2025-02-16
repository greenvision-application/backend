/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto) {
    try {
      const task = await this.prisma.task.create({
        data: createTaskDto,
        include: {
          Care_Schedule: true,
        },
      });
      return task;
    } catch (error) {
      throw new BadRequestException('Failed to create task');
    }
  }

  async findAll() {
    try {
      const tasks = await this.prisma.task.findMany({
        include: {
          Care_Schedule: true,
        },
      });
      return tasks;
    } catch (error) {
      throw new BadRequestException('Failed to retrieve tasks');
    }
  }

  async findOne(id: string) {
    try {
      const task = await this.prisma.task.findUnique({
        where: { id },
        include: {
          Care_Schedule: true,
        },
      });

      if (!task) {
        throw new NotFoundException(`Task with ID ${id} not found`);
      }

      return task;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to retrieve task');
    }
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    try {
      const existingTask = await this.prisma.task.findUnique({
        where: { id },
      });

      if (!existingTask) {
        throw new NotFoundException(`Task with ID ${id} not found`);
      }

      const task = await this.prisma.task.update({
        where: { id },
        data: updateTaskDto,
        include: {
          Care_Schedule: true,
        },
      });

      return task;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to update task');
    }
  }

  async remove(id: string) {
    try {
      const existingTask = await this.prisma.task.findUnique({
        where: { id },
      });

      if (!existingTask) {
        throw new NotFoundException(`Task with ID ${id} not found`);
      }

      await this.prisma.task.delete({
        where: { id },
      });

      return { message: 'Task deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to delete task');
    }
  }
}
