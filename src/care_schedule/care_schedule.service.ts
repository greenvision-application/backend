import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  HttpException,
  HttpStatus,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { CreateCareScheduleDto } from './dto/create-care_schedule.dto';
import { UpdateCareScheduleDto } from './dto/update-care_schedule.dto';
import { PrismaService } from '../prisma/prisma.service';
import { GeminiService } from '@/gemini/gemini.service';
import { UserPlantService } from '@/user_plant/user_plant.service';
import { TasksService } from '@/tasks/tasks.service';

@Injectable()
export class CareScheduleService {
  constructor(
    private prisma: PrismaService,
    private geminiService: GeminiService,
    private userPlantService: UserPlantService,
    @Inject(forwardRef(() => TasksService)) private taskService: TasksService,
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
          phase_name: createCareScheduleDto.phase_name,
          desc: createCareScheduleDto.desc,
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
          phase_name: updateCareScheduleDto.phase_name,
          desc: updateCareScheduleDto.desc,
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

      const existingSchedules = await this.prisma.care_Schedule.findMany({
        where: {
          user_plant_id: user_plant_id,
        },
      });

      if (existingSchedules && existingSchedules.length > 0) {
        return existingSchedules.map((careSchedule) => ({ careSchedule }));
      }

      const plantData =
        await this.userPlantService.findUserPlantToGenerateSchedule(
          user_plant_id,
        );

      const schedules =
        await this.geminiService.generateScheduleTakeCarePlant(plantData);

      const createdCareSchedules = [];

      for (const schedule of schedules) {
        try {
          const careSchedule = await this.prisma.care_Schedule.create({
            data: {
              start_date: new Date(schedule.start_date),
              end_date: new Date(schedule.end_date),
              phase_name: schedule.phase_name,
              desc: schedule.desc,
              user_plant_id: user_plant_id,
            },
          });

          createdCareSchedules.push({ careSchedule });
        } catch (dbError) {
          throw new InternalServerErrorException(
            dbError.message || 'Failed to save schedule to database',
          );
        }
      }
      // setTimeout(() => {
      //   try {
      //     createdCareSchedules.forEach(({ careSchedule }) => {
      //       this.taskService.generateTask(careSchedule.id);
      //     });
      //   } catch (err) {
      //     throw err;
      //   }
      // }, 0);

      return createdCareSchedules;
    } catch (error) {
      console.error('Error in generateSchedule:', error);
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

  async getScheduleInforToPrompt(id: string) {
    try {
      const careSchedulePlant = await this.prisma.care_Schedule.findUnique({
        where: { id },
        select: {
          start_date: true,
          end_date: true,
          phase_name: true,
          User_Plant: {
            select: {
              caring_plant_infor: true,
              plant_site: true,
              Plant: {
                select: {
                  plant_name: true,
                  scientific_name: true,
                  overview: true,
                  difficulty_level: true,
                  soil_type: true,
                  habitatLocation: true,
                  minTemperature: true,
                  maxTemperature: true,
                  minMatureSize: true,
                  maxMatureSize: true,
                  humidityRange: true,
                  lightRequirement: true,
                  Category: {
                    select: {
                      category_name: true,
                    },
                  },
                  Phase: {
                    where: {
                      phase_name: (
                        await this.prisma.care_Schedule.findFirst({
                          where: { id },
                          select: { phase_name: true },
                        })
                      )?.phase_name,
                    },
                    select: {
                      phase_name: true,
                      desc: true,
                      duration: true,
                      size: true,
                      Care_instruction: {
                        select: {
                          water: true,
                          sunlight: true,
                          moisture: true,
                          temperature: true,
                          fertilizer: true,
                          pruning: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!careSchedulePlant) {
        throw new HttpException(
          `Care schedule with ID ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      const formattedData = {
        start_date: {
          description:
            'Thời gian bắt đầu của lịch trình chăm sóc cây cho giai đoạn này của cây.',
          value: careSchedulePlant?.start_date || null,
        },
        end_date: {
          description:
            'Thời gian kết thúc cửa lịch trình chăm sóc cây trong giai đoạn này của cây.',
          value: careSchedulePlant?.end_date || null,
        },
        phase_name_schedule: {
          description:
            'Tên của gian đoạn trong lịch trình này, tên này sẽ trùng với tên trong giai đoạn phát triển của cây',
          value: careSchedulePlant?.phase_name || null,
        },
        plant_site: {
          description: 'Nơi mà cây trồng đang được đặt để chăm sóc bởi user',
          value: careSchedulePlant?.User_Plant.plant_site || null,
        },
        caring_plant_infor: {
          description:
            'Tất cả thông tin của cây đang trồng hiện tại của user cung cấp',
          value: careSchedulePlant?.User_Plant?.caring_plant_infor || null,
        },
        plant_name: {
          description: 'Tên thông thường của cây tại Việt Nam',
          value: careSchedulePlant?.User_Plant?.Plant?.plant_name || null,
        },
        scientific_name: {
          description: 'Tên khoa học của cây',
          value: careSchedulePlant?.User_Plant?.Plant?.scientific_name || null,
        },
        overview: {
          description: 'Tóm tắt về cây',
          value: careSchedulePlant?.User_Plant?.Plant?.overview || null,
        },
        difficulty_level: {
          description: 'Mức độ khó khi chăm sóc cây',
          value: careSchedulePlant?.User_Plant?.Plant?.difficulty_level || null,
        },
        soil_type: {
          description: 'Loại đất thích hợp cho cây',
          value: careSchedulePlant?.User_Plant?.Plant?.soil_type || null,
        },
        habitatLocation: {
          description: 'Vị trí thích hợp để trồng cây',
          value: careSchedulePlant?.User_Plant?.Plant?.habitatLocation || null,
        },
        minTemperature: {
          description: 'Nhiệt độ tối thiểu cây có thể chịu được',
          value: careSchedulePlant?.User_Plant?.Plant?.minTemperature || null,
        },
        maxTemperature: {
          description: 'Nhiệt độ tối đa cây có thể chịu được',
          value: careSchedulePlant?.User_Plant?.Plant?.maxTemperature || null,
        },
        minMatureSize: {
          description: 'Kích thước nhỏ nhất khi cây trưởng thành',
          value: careSchedulePlant?.User_Plant?.Plant?.minMatureSize || null,
        },
        maxMatureSize: {
          description: 'Kích thước lớn nhất khi cây trưởng thành',
          value: careSchedulePlant?.User_Plant?.Plant?.maxMatureSize || null,
        },
        humidityRange: {
          description:
            'Phạm vi độ ẩm phù hợp với cây (NONE, VERY_LOW, LOW, MEDIUM, HIGH, VERY_HIGH)',
          value: careSchedulePlant?.User_Plant?.Plant?.humidityRange || null,
        },
        lightRequirement: {
          description:
            'Lượng ánh sáng cần thiết (NONE, VERY_LOW, LOW, MEDIUM, HIGH, VERY_HIGH)',
          value: careSchedulePlant?.User_Plant?.Plant?.lightRequirement || null,
        },
        category: {
          description: 'Loại cây theo danh mục',
          value:
            careSchedulePlant?.User_Plant?.Plant?.Category?.category_name ||
            null,
        },
        phase:
          careSchedulePlant?.User_Plant?.Plant?.Phase?.map((p) => ({
            phase_name: {
              description: 'Tên giai đoạn phát triển của cây',
              value: p.phase_name || null,
            },
            desc: {
              description: 'Mô tả về giai đoạn phát triển này',
              value: p.desc || null,
            },
            duration: {
              description: 'Tổng số giờ cây ở trong giai đoạn này',
              value: p.duration || null,
            },
            size: {
              description: 'Kích thước trung bình trong giai đoạn này',
              value: p.size || null,
            },
            care_instruction: p.Care_instruction
              ? {
                  water: {
                    description: 'Lượng nước cần tưới',
                    value: p.Care_instruction.water || null,
                  },
                  sunlight: {
                    description: 'Mức độ ánh sáng cần thiết',
                    value: p.Care_instruction.sunlight || null,
                  },
                  moisture: {
                    description: 'Độ ẩm yêu cầu',
                    value: p.Care_instruction.moisture || null,
                  },
                  temperature: {
                    description: 'Nhiệt độ lý tưởng',
                    value: p.Care_instruction.temperature || null,
                  },
                  fertilizer: {
                    description: 'Lượng phân bón cần thiết',
                    value: p.Care_instruction.fertilizer || null,
                  },
                  pruning: {
                    description: 'Cần tỉa cây hay không',
                    value: p.Care_instruction.pruning || null,
                  },
                }
              : null,
          })) || [],
      };

      return formattedData;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        `Failed to get care schedule information: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
