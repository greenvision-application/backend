import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePhaseDto } from './dto/create-phase.dto';
import { UpdatePhaseDto } from './dto/update-phase.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PhaseService {
  constructor(private prisma: PrismaService) {}

  async create(createPhaseDto: CreatePhaseDto) {
    try {
      const plant = await this.prisma.plant.findUnique({
        where: { id: createPhaseDto.plant_id },
      });

      if (!plant) {
        throw new NotFoundException(
          `Plant with ID ${createPhaseDto.plant_id} not found`,
        );
      }

      return await this.prisma.phase.create({
        data: {
          phase_name: createPhaseDto.phase_name,
          desc: createPhaseDto.desc,
          duration: createPhaseDto.duration,
          size: createPhaseDto.size,
          plant_id: createPhaseDto.plant_id,
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Failed to create phase: ${error.message}`);
    }
  }

  async findAll() {
    try {
      return await this.prisma.phase.findMany({
        include: {
          Plant: true,
          Care_instruction: true,
        },
      });
    } catch (error) {
      throw new Error(`Failed to fetch phases: ${error.message}`);
    }
  }

  async findOne(id: string) {
    try {
      const phase = await this.prisma.phase.findUnique({
        where: { id },
        include: {
          Plant: true,
          Care_instruction: true,
        },
      });

      if (!phase) {
        throw new NotFoundException(`Phase with ID ${id} not found`);
      }

      return phase;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Failed to fetch phase: ${error.message}`);
    }
  }

  async update(id: string, updatePhaseDto: UpdatePhaseDto) {
    try {
      const existingPhase = await this.prisma.phase.findUnique({
        where: { id },
      });

      if (!existingPhase) {
        throw new NotFoundException(`Phase with ID ${id} not found`);
      }

      return await this.prisma.phase.update({
        where: { id },
        data: {
          phase_name: updatePhaseDto.phase_name,
          desc: updatePhaseDto.desc,
          duration: updatePhaseDto.duration,
          size: updatePhaseDto.size,
          plant_id: updatePhaseDto.plant_id,
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Failed to update phase: ${error.message}`);
    }
  }

  async remove(id: string) {
    try {
      const existingPhase = await this.prisma.phase.findUnique({
        where: { id },
      });

      if (!existingPhase) {
        throw new NotFoundException(`Phase with ID ${id} not found`);
      }

      return await this.prisma.phase.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Failed to delete phase: ${error.message}`);
    }
  }
}
