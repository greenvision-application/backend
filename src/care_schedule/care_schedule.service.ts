import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateCareScheduleDto } from './dto/create-care_schedule.dto';
import { UpdateCareScheduleDto } from './dto/update-care_schedule.dto';
import { PrismaService } from '../prisma/prisma.service';
import { GeminiService } from '@/gemini/gemini.service';
import { UserPlantService } from '@/user_plant/user_plant.service';
import { TasksService } from '@/tasks/tasks.service';
import { TASK_STATUS } from '@prisma/client';

@Injectable()
export class CareScheduleService {
  constructor(
    private prisma: PrismaService,
    private geminiService: GeminiService,
    private userPlantService: UserPlantService,
    private taskService: TasksService,
  ) {}

  async create(createCareScheduleDto: CreateCareScheduleDto) {
    try {
      if (createCareScheduleDto.start_date >= createCareScheduleDto.end_date) {
        throw new BadRequestException('Start date must be before end date');
      }

      const userPlant = await this.prisma.user_Plant.findUnique({
        where: { id: createCareScheduleDto.user_plant_id },
      });

      if (!userPlant) {
        throw new NotFoundException('User plant not found');
      }

      return await this.prisma.care_Schedule.create({
        data: {
          start_date: createCareScheduleDto.start_date,
          end_date: createCareScheduleDto.end_date,
          user_plant_id: createCareScheduleDto.user_plant_id,
        },
      });
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new BadRequestException('Failed to create care schedule');
    }
  }
  async findAll() {
    try {
      return await this.prisma.care_Schedule.findMany({
        include: {
          User_Plant: true,
          Task: true,
        },
      });
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Failed to fetch care schedules',
      );
    }
  }
  async findOne(id: string) {
    try {
      const careSchedule = await this.prisma.care_Schedule.findUnique({
        where: { id },
        include: {
          User_Plant: true,
          Task: true,
        },
      });

      if (!careSchedule) {
        throw new NotFoundException(`Care schedule with ID ${id} not found`);
      }

      return careSchedule;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to fetch care schedule');
    }
  }

  async update(id: string, updateCareScheduleDto: UpdateCareScheduleDto) {
    try {
      const existingSchedule = await this.prisma.care_Schedule.findUnique({
        where: { id },
      });

      if (!existingSchedule) {
        throw new NotFoundException(`Care schedule with ID ${id} not found`);
      }

      if (updateCareScheduleDto.start_date && updateCareScheduleDto.end_date) {
        if (
          updateCareScheduleDto.start_date >= updateCareScheduleDto.end_date
        ) {
          throw new BadRequestException('Start date must be before end date');
        }
      }

      if (updateCareScheduleDto.user_plant_id) {
        const userPlant = await this.prisma.user_Plant.findUnique({
          where: { id: updateCareScheduleDto.user_plant_id },
        });

        if (!userPlant) {
          throw new NotFoundException('User plant not found');
        }
      }

      return await this.prisma.care_Schedule.update({
        where: { id },
        data: {
          start_date: updateCareScheduleDto.start_date,
          end_date: updateCareScheduleDto.end_date,
          user_plant_id: updateCareScheduleDto.user_plant_id,
        },
      });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException('Failed to update care schedule');
    }
  }

  async remove(id: string) {
    try {
      const existingSchedule = await this.prisma.care_Schedule.findUnique({
        where: { id },
      });

      if (!existingSchedule) {
        throw new NotFoundException(`Care schedule with ID ${id} not found`);
      }

      return await this.prisma.care_Schedule.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to delete care schedule');
    }
  }

  async generateSchedule(user_plant_id: string) {
    try {
      if (!user_plant_id) {
        throw new BadRequestException('User Plant ID is required');
      }

      const userPlant = await this.userPlantService.findOne(user_plant_id);

      if (!userPlant) {
        throw new NotFoundException(
          `User plant with ID ${user_plant_id} not found`,
        );
      }

      const plantData =
        await this.userPlantService.getPlantInforToPrompt(user_plant_id);

      const schedules =
        await this.geminiService.generateScheduleTakeCarePlant(plantData);

      const createdCareSchedules = [];

      for (const schedule of schedules) {
        try {
          const careSchedule = await this.prisma.care_Schedule.create({
            data: {
              start_date: new Date(schedule.start_date),
              end_date: new Date(schedule.end_date),
              user_plant_id: user_plant_id,
            },
          });

          const tasks = await this.prisma.task.createMany({
            data: schedule.tasks.map((task) => ({
              task_date: new Date(task.task_date),
              task_time: new Date(
                `${task.task_date}T${task.task_time}:00.000Z`,
              ),
              content: task.content,
              completion_status: TASK_STATUS.NOT_YET,
              care_schedule_id: careSchedule.id,
            })),
          });

          createdCareSchedules.push({ careSchedule, tasks });
        } catch (dbError) {
          throw new InternalServerErrorException(
            dbError.message || 'Failed to save schedule to database',
          );
        }
      }

      return createdCareSchedules;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred while generating the care schedule',
      );
    }
  }
}
