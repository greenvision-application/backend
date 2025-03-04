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
}
