import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreatePlantDto } from './dto/create-plant.dto';
import { UpdatePlantDto } from './dto/update-plant.dto';
import { GeminiService } from '@/gemini/gemini.service';
import { PhaseService } from '@/phase/phase.service';
import { CareInstructionService } from '@/care_instruction/care_instruction.service';

@Injectable()
export class PlantsService {
  constructor(
    private prisma: PrismaService,
    private readonly geminiService: GeminiService,
    private readonly phaseService: PhaseService,
    private readonly careInstructionService: CareInstructionService,
  ) {}
  async create(plantData: CreatePlantDto) {
    return await this.prisma.plant.create({ data: plantData });
  }
  async findAll() {
    try {
      const plants = await this.prisma.plant.findMany({
        where: {
          approved_content: true,
        },
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

  async findAllForClient(client_id: string) {
    console.log(client_id);
    try {
      const plants = await this.prisma.plant.findMany({
        where: {
          approved_content: true,
        },
        select: {
          plant_name: true,
          image_url: true,
          id: true,
          User_Plant: {
            where: { user_id: client_id },
            select: {
              favorite: true,
              nickname: true,
            },
          },
        },
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

  async createPlantPhaseWithAI(
    plant_name: string,
    scientific_name: string,
    plant_id: string,
  ) {
    try {
      const phaseResult = await this.geminiService.generatePhaseOfPlant(
        plant_name,
        scientific_name,
      );

      for (const phase of phaseResult) {
        // Tạo record phase
        const createdPhase = await this.phaseService.create({
          phase_name: phase.phase_name,
          duration: phase.duration,
          size: phase.size,
          desc: phase.desc,
          plant_id,
        });

        // Tạo record care_instruction
        await this.careInstructionService.create({
          water: phase.care_instruction.water,
          sunlight: phase.care_instruction.sunlight,
          moisture: phase.care_instruction.moisture,
          temperature: phase.care_instruction.temperature,
          fertilizer: phase.care_instruction.fertilizer,
          pruning: phase.care_instruction.pruning,
          phase_id: createdPhase.id,
        });
      }

      return {
        message: 'Plant phases and care instructions created successfully',
      };
    } catch (error) {
      throw new Error(
        `Failed to create plant phases and care instructions: ${error.message}`,
      );
    }
  }
}
