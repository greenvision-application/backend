import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { GeminiService } from '@/gemini/gemini.service';
import { CareScheduleService } from '@/care_schedule/care_schedule.service';
import { TASK_STATUS } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(
    private prisma: PrismaService,
    private geminiService: GeminiService,
    private careSchedule: CareScheduleService,
  ) {}

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
      throw new BadRequestException(error.message || 'Failed to create task');
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
      throw new BadRequestException(
        error.message || 'Failed to retrieve tasks',
      );
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

  async generateTask(care_schedule_id: string) {
    try {
      if (!care_schedule_id) {
        throw new BadRequestException('User Plant ID is required');
      }

      const careSchedule = await this.careSchedule.findOne(care_schedule_id);

      if (!careSchedule) {
        throw new NotFoundException(
          `Care schedule with ID ${care_schedule_id} not found`,
        );
      }

      const careScheduleData =
        await this.careSchedule.getScheduleInforToPrompt(care_schedule_id);

      const taskGenerate =
        await this.geminiService.generateTaskTakeCarePlant(careScheduleData);

      await this.prisma.task.createMany({
        data: taskGenerate.map((task) => ({
          task_date: new Date(task.task_date),
          task_time: new Date(`${task.task_date}T${task.task_time}:00.000Z`),
          content: task.content,
          completion_status: TASK_STATUS.DO,
          care_schedule_id,
        })),
      });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred while generating the task take care plant',
      );
    }
  }

  async getTaskForClient(care_schedule_id: string) {
    try {
      if (!care_schedule_id) {
        throw new BadRequestException('Care schedule ID is required');
      }

      const careSchedule = await this.careSchedule.findOne(care_schedule_id);

      if (!careSchedule) {
        throw new NotFoundException(
          `Care schedule with ID ${care_schedule_id} not found`,
        );
      }

      let allTask = await this.prisma.task.findMany({
        where: { care_schedule_id },
        orderBy: [{ task_date: 'asc' }, { task_time: 'asc' }],
        select: {
          id: true,
          content: true,
          completion_status: true,
          task_date: true,
          task_time: true,
        },
      });

      if (allTask.length === 0) {
        await this.generateTask(care_schedule_id);
        allTask = await this.prisma.task.findMany({
          where: { care_schedule_id },
          orderBy: [{ task_date: 'asc' }, { task_time: 'asc' }],
          select: {
            id: true,
            content: true,
            completion_status: true,
            task_date: true,
            task_time: true,
          },
        });
      }

      return { message: 'Get tasks successfully', tasks: allTask };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred while retrieving tasks',
      );
    }
  }
}
