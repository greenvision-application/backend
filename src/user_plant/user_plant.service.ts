import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserPlantDto } from './dto/create-user_plant.dto';
import { UpdateUserPlantDto } from './dto/update-user_plant.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserPlantService {
  constructor(private prisma: PrismaService) {}

  async create(createUserPlantDto: CreateUserPlantDto) {
    try {
      const userPlant = await this.prisma.user_Plant.create({
        data: {
          nickname: createUserPlantDto.nickname,
          favorite: createUserPlantDto.favorite,
          growth_stage: createUserPlantDto.growth_stage,
          planting_date: createUserPlantDto.planting_date,
          image_url: createUserPlantDto.image_url,
          plant_site: createUserPlantDto.plant_site,
          caring_plant_infor: createUserPlantDto.caring_plant_infor,
          plant_id: createUserPlantDto.plant_id,
          user_id: createUserPlantDto.user_id,
        },
      });
      return userPlant;
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to create user plant',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async findAll() {
    try {
      const userPlants = await this.prisma.user_Plant.findMany({
        include: {
          Plant: true,
          User: true,
          Care_Schedule: true,
        },
      });
      return userPlants;
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to fetch user plants',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string) {
    try {
      const userPlant = await this.prisma.user_Plant.findUnique({
        where: { id },
        include: {
          Plant: true,
          User: true,
          Care_Schedule: true,
        },
      });
      if (!userPlant) {
        throw new HttpException('User plant not found', HttpStatus.NOT_FOUND);
      }
      return userPlant;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || 'Failed to fetch user plant',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, updateUserPlantDto: UpdateUserPlantDto) {
    try {
      const userPlant = await this.prisma.user_Plant.update({
        where: { id },
        data: {
          nickname: updateUserPlantDto.nickname,
          favorite: updateUserPlantDto.favorite,
          growth_stage: updateUserPlantDto.growth_stage,
          planting_date: updateUserPlantDto.planting_date,
          image_url: updateUserPlantDto.image_url,
          plant_site: updateUserPlantDto.plant_site,
          caring_plant_infor: updateUserPlantDto.caring_plant_infor,
          plant_id: updateUserPlantDto.plant_id,
          user_id: updateUserPlantDto.user_id,
        },
      });
      return userPlant;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new HttpException('User plant not found', HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        error.message || 'Failed to update user plant',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.user_Plant.delete({
        where: { id },
      });
      return { message: 'User plant deleted successfully' };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new HttpException('User plant not found', HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        error.message || 'Failed to delete user plant',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getPlantInforToPrompt(id: string) {
    try {
      const userPlant = await this.prisma.user_Plant.findUnique({
        where: { id },
        select: {
          growth_stage: true,
          plant_site: true,
          planting_date: true,
          caring_plant_infor: true,
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
      });

      if (!userPlant) {
        throw new HttpException(
          `Plant with ID ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      const growthStage = await this.prisma.phase.findUnique({
        where: { id: userPlant.growth_stage },
        select: { phase_name: true },
      });

      userPlant.growth_stage = growthStage?.phase_name || null;

      const formattedData = {
        plant_name: {
          description: 'Tên thông thường của cây tại Việt Nam',
          value: userPlant.Plant?.plant_name || null,
        },
        scientific_name: {
          description: 'Tên khoa học của cây',
          value: userPlant.Plant?.scientific_name || null,
        },
        overview: {
          description: 'Tóm tắt về cây',
          value: userPlant.Plant?.overview || null,
        },
        difficulty_level: {
          description: 'Mức độ khó khi chăm sóc cây',
          value: userPlant.Plant?.difficulty_level || null,
        },
        soil_type: {
          description: 'Loại đất thích hợp cho cây',
          value: userPlant.Plant?.soil_type || null,
        },
        habitatLocation: {
          description: 'Vị trí thích hợp để trồng cây',
          value: userPlant.Plant?.habitatLocation || null,
        },
        minTemperature: {
          description: 'Nhiệt độ tối thiểu cây có thể chịu được',
          value: userPlant.Plant?.minTemperature || null,
        },
        maxTemperature: {
          description: 'Nhiệt độ tối đa cây có thể chịu được',
          value: userPlant.Plant?.maxTemperature || null,
        },
        minMatureSize: {
          description: 'Kích thước nhỏ nhất khi cây trưởng thành',
          value: userPlant.Plant?.minMatureSize || null,
        },
        maxMatureSize: {
          description: 'Kích thước lớn nhất khi cây trưởng thành',
          value: userPlant.Plant?.maxMatureSize || null,
        },
        humidityRange: {
          description:
            'Phạm vi độ ẩm phù hợp với cây (NONE, VERY_LOW, LOW, MEDIUM, HIGH, VERY_HIGH)',
          value: userPlant.Plant?.humidityRange || null,
        },
        lightRequirement: {
          description:
            'Lượng ánh sáng cần thiết (NONE, VERY_LOW, LOW, MEDIUM, HIGH, VERY_HIGH)',
          value: userPlant.Plant?.lightRequirement || null,
        },
        category: {
          description: 'Loại cây theo danh mục',
          value: userPlant.Plant?.Category?.category_name || null,
        },
        phase:
          userPlant.Plant?.Phase?.map((p) => ({
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
                    value: p.Care_instruction.water,
                  },
                  sunlight: {
                    description: 'Mức độ ánh sáng cần thiết',
                    value: p.Care_instruction.sunlight,
                  },
                  moisture: {
                    description: 'Độ ẩm yêu cầu',
                    value: p.Care_instruction.moisture,
                  },
                  temperature: {
                    description: 'Nhiệt độ lý tưởng',
                    value: p.Care_instruction.temperature,
                  },
                  fertilizer: {
                    description: 'Lượng phân bón cần thiết',
                    value: p.Care_instruction.fertilizer,
                  },
                  pruning: {
                    description: 'Cần tỉa cây hay không',
                    value: p.Care_instruction.pruning,
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
        `Failed to get plant information: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findSchedulePlant(client_id: string) {
    try {
      const userPlants = await this.prisma.user_Plant.findMany({
        where: {
          user_id: client_id,
        },
        select: {
          id: true,
          nickname: true,
          plant_site: true,
          image_url: true,
          Plant: {
            select: {
              plant_name: true,
              image_url: true,
            },
          },
        },
      });
      return userPlants;
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to fetch user plants',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findUserPlantToGenerateSchedule(id: string) {
    try {
      const userPlant = await this.prisma.user_Plant.findUnique({
        where: { id },
        select: {
          growth_stage: true,
          plant_site: true,
          planting_date: true,
          caring_plant_infor: true,
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
                select: {
                  phase_name: true,
                  desc: true,
                  duration: true,
                  size: true,
                },
              },
            },
          },
        },
      });
      if (!userPlant) {
        throw new HttpException(
          `Plant with ID ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      const growthStage = await this.prisma.phase.findUnique({
        where: { id: userPlant.growth_stage },
        select: { phase_name: true },
      });

      userPlant.growth_stage = growthStage?.phase_name || null;

      const formattedData = {
        plant_name: {
          description: 'Common name of the plant in Vietnam',
          value: userPlant.Plant?.plant_name || null,
        },
        scientific_name: {
          description: 'Scientific name of the plant',
          value: userPlant.Plant?.scientific_name || null,
        },
        overview: {
          description: 'Overview of the plant',
          value: userPlant.Plant?.overview || null,
        },
        caring_plant_infor: {
          description:
            'Information about the plant currently being cared for by the user',
          value: userPlant.caring_plant_infor || null,
        },
        planting_date: {
          description: 'The date the user started planting this plant',
          value: userPlant.planting_date || null,
        },
        plant_site: {
          description:
            'The location where the user is keeping this plant for care',
          value: userPlant.plant_site || null,
        },
        difficulty_level: {
          description: 'Difficulty level of plant care',
          value: userPlant.Plant?.difficulty_level || null,
        },
        soil_type: {
          description: 'Suitable soil type for the plant',
          value: userPlant.Plant?.soil_type || null,
        },
        habitatLocation: {
          description: 'Ideal location for planting the plant',
          value: userPlant.Plant?.habitatLocation || null,
        },
        minTemperature: {
          description: 'Minimum temperature the plant can tolerate',
          value: userPlant.Plant?.minTemperature || null,
        },
        maxTemperature: {
          description: 'Maximum temperature the plant can tolerate',
          value: userPlant.Plant?.maxTemperature || null,
        },
        minMatureSize: {
          description: 'Minimum mature size of the plant',
          value: userPlant.Plant?.minMatureSize || null,
        },
        maxMatureSize: {
          description: 'Maximum mature size of the plant',
          value: userPlant.Plant?.maxMatureSize || null,
        },
        humidityRange: {
          description:
            'Suitable humidity range for the plant (NONE, VERY_LOW, LOW, MEDIUM, HIGH, VERY_HIGH)',
          value: userPlant.Plant?.humidityRange || null,
        },
        lightRequirement: {
          description:
            'Required light level (NONE, VERY_LOW, LOW, MEDIUM, HIGH, VERY_HIGH)',
          value: userPlant.Plant?.lightRequirement || null,
        },
        category: {
          description: 'Plant category',
          value: userPlant.Plant?.Category?.category_name || null,
        },
        growth_stage: {
          description: 'Current growth stage of the plant provided by the user',
          value: userPlant.growth_stage,
        },
        phase:
          userPlant.Plant?.Phase?.map((p) => ({
            phase_name: {
              description: 'Development phase name of the plant',
              value: p.phase_name || null,
            },
            desc: {
              description: 'Description of this development phase',
              value: p.desc || null,
            },
            duration: {
              description: 'Total hours the plant stays in this phase',
              value: p.duration || null,
            },
            size: {
              description: 'Average size in this phase',
              value: p.size || null,
            },
          })) || [],
      };

      return formattedData;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        `Failed to get plant information: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
