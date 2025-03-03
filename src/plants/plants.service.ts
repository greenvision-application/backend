import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreatePlantDto } from './dto/create-plant.dto';
import { UpdatePlantDto } from './dto/update-plant.dto';
import { GeminiService } from '@/gemini/gemini.service';

@Injectable()
export class PlantsService {
  constructor(
    private prisma: PrismaService,
    private readonly geminiService: GeminiService,
  ) {}
  create(plantData: CreatePlantDto) {
    return this.prisma.plant.create({ data: plantData });
  }

  async findAll() {
    try {
      const plants = await this.prisma.plant.findMany({
        orderBy: { created_at: 'desc' },
      });
      if (!plants || plants.length === 0) {
        throw new NotFoundException('No plants found');
      }
      return plants;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Failed to fetch plants: ${error.message}`);
    }
  }

  async findOne(id: string) {
    try {
      const plant = await this.prisma.plant.findUnique({
        where: { id },
      });

      if (!plant) {
        throw new NotFoundException(`Plant with id ${id} not found`);
      }

      return plant;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
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

  async remove(id: string) {
    try {
      const plant = await this.prisma.plant.findUnique({
        where: { id },
      });

      if (!plant) {
        throw new NotFoundException(`Plant with id ${id} not found`);
      }

      await this.prisma.plant.delete({
        where: { id },
      });

      return { message: `Plant with id ${id} has been deleted` };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Failed to delete plant with id ${id}: ${error.message}`);
    }
  }

  async scanPlant(plantImageUrl: string) {
    try {
      const identifyPlant = await this.geminiService.analyzeImageUrl({
        imageUrl: plantImageUrl,
        sessionId: null,
      });
      const { scientific_name, plant_name } = identifyPlant;

      const existingPlant = await this.prisma.plant.findFirst({
        where: {
          OR: [{ scientific_name }, { plant_name }],
        },
      });
      if (existingPlant) {
        return existingPlant;
      }

      return identifyPlant;

      // If plant doesn't exist, create new plant record
      // const newPlant = await this.prisma.plant.create({
      //   data: {
      //     scientific_name,
      //     plant_name,
      //   },
      // });
      // return newPlant;
    } catch (error) {
      throw new Error(`Failed to scan plant: ${error.message}`);
    }
  }

  async generatePhasePlant(plant_name: string, scientificName: string) {
    try {
      const aiResponse = await this.geminiService.generatePhaseOfPlant(
        plant_name,
        scientificName,
      );
      return aiResponse;
    } catch (error) {
      throw new Error(`Failed to generate phase of plant: ${error.message}`);
    }
  }
}
