import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreatePlantDto } from './dto/create-plant.dto';
import { UpdatePlantDto } from './dto/update-plant.dto';

@Injectable()
export class PlantsService {
  constructor(private prisma: PrismaService) {}
  create(plantData: CreatePlantDto) {
    return this.prisma.plant.create({ data: plantData });
  }

  findAll() {
    return `This action returns all plants`;
  }

  findOne(id: number) {
    return `This action returns a #${id} plant`;
  }

  async update(id: string, updatePlantDto: UpdatePlantDto) {
    try {
      const plant = await this.prisma.plant.findUnique({
        where: { id },
      });

      if (!plant) {
        throw new Error(`Plant with id ${id} not found`);
      }

      const updatedPlant = await this.prisma.plant.update({
        where: { id },
        data: {
          ...updatePlantDto,
        },
      });
      return updatedPlant;
    } catch (error) {
      throw new Error(`Failed to update plant with id ${id}: ${error.message}`);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} plant`;
  }
}
