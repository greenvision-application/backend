import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreatePlantDto } from './dto/create-plant.dto';
import { UpdatePlantDto } from './dto/update-plant.dto';

@Injectable()
export class PlantsService {
  constructor(private prisma: PrismaService) {}
  create(plantData: CreatePlantDto) {
    return this.prisma.plant.create({ data: plantData });
  }

  async findAll() {
    try {
      const plants = await this.prisma.plant.findMany({
        orderBy: { created_at: 'desc' },
      });
      if (!plants || plants.length === 0) {
        throw new Error('No plants found');
      }
      return plants;
    } catch (error) {
      throw new Error(`Failed to fetch plants: ${error.message}`);
    }
  }

  async findOne(id: string) {
    try {
      const plant = await this.prisma.plant.findUnique({
        where: { id },
      });

      if (!plant) {
        throw new Error(`Plant with id ${id} not found`);
      }

      return plant;
    } catch (error) {
      throw new Error(`Failed to fetch plant with id ${id}: ${error.message}`);
    }
  }

  async update(id: string, updatePlantDto: UpdatePlantDto) {
    try {
      const plant = await this.prisma.plant.findUnique({
        where: { id },
      });

      if (!plant) {
        throw new NotFoundException(`Plant with id ${id} not found`);
      }

      const updatedPlant = await this.prisma.plant.update({
        where: { id },
        data: {
          ...updatePlantDto,
        },
      });
      return updatedPlant;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Failed to update plant with id ${id}: ${error.message}`);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} plant`;
  }
}
