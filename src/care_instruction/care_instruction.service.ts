import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCareInstructionDto } from './dto/create-care_instruction.dto';
import { UpdateCareInstructionDto } from './dto/update-care_instruction.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CareInstructionService {
  constructor(private prisma: PrismaService) {}

  async create(createCareInstructionDto: CreateCareInstructionDto) {
    try {
      const existingInstruction = await this.prisma.care_instruction.findUnique(
        {
          where: { phase_id: createCareInstructionDto.phase_id },
        },
      );

      if (existingInstruction) {
        throw new Error(
          `Care instruction for phase ${createCareInstructionDto.phase_id} already exists`,
        );
      }

      const careInstruction = await this.prisma.care_instruction.create({
        data: {
          water: createCareInstructionDto.water,
          sunlight: createCareInstructionDto.sunlight,
          moisture: createCareInstructionDto.moisture,
          temperature: createCareInstructionDto.temperature,
          fertilizer: createCareInstructionDto.fertilizer,
          pruning: createCareInstructionDto.pruning,
          phase_id: createCareInstructionDto.phase_id,
        },
      });
      return careInstruction;
    } catch (error) {
      throw error;
    }
  }
  async findAll() {
    try {
      return await this.prisma.care_instruction.findMany({
        include: {
          Phase: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const careInstruction = await this.prisma.care_instruction.findUnique({
        where: { id },
        include: {
          Phase: true,
        },
      });

      if (!careInstruction) {
        throw new NotFoundException(`Care instruction with ID ${id} not found`);
      }

      return careInstruction;
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, updateCareInstructionDto: UpdateCareInstructionDto) {
    try {
      const existingCareInstruction =
        await this.prisma.care_instruction.findUnique({
          where: { id },
        });

      if (!existingCareInstruction) {
        throw new NotFoundException(`Care instruction with ID ${id} not found`);
      }

      const updatedCareInstruction = await this.prisma.care_instruction.update({
        where: { id },
        data: {
          water: updateCareInstructionDto.water,
          sunlight: updateCareInstructionDto.sunlight,
          moisture: updateCareInstructionDto.moisture,
          temperature: updateCareInstructionDto.temperature,
          fertilizer: updateCareInstructionDto.fertilizer,
          pruning: updateCareInstructionDto.pruning,
          phase_id: updateCareInstructionDto.phase_id,
        },
      });

      return updatedCareInstruction;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const existingCareInstruction =
        await this.prisma.care_instruction.findUnique({
          where: { id },
        });

      if (!existingCareInstruction) {
        throw new NotFoundException(`Care instruction with ID ${id} not found`);
      }

      await this.prisma.care_instruction.delete({
        where: { id },
      });

      return { message: `Care instruction with ID ${id} has been deleted` };
    } catch (error) {
      throw error;
    }
  }
}
