import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  async create(createRoleDto: CreateRoleDto) {
    try {
      // Kiểm tra xem role có tồn tại chưa
      const existingRole = await this.prisma.role.findUnique({
        where: { role_name: createRoleDto.role_name },
      });

      if (existingRole) {
        throw new BadRequestException(
          `Role with name "${createRoleDto.role_name}" already exists.`,
        );
      }
      const role = await this.prisma.role.create({
        data: createRoleDto,
      });
      return role;
    } catch (error) {
      throw new BadRequestException('Failed to create role');
    }
  }

  async findAll() {
    try {
      const roles = await this.prisma.role.findMany({});
      return roles;
    } catch (error) {
      throw new BadRequestException('Failed to retrieve roles');
    }
  }

  async findOne(id: string) {
    try {
      const role = await this.prisma.role.findUnique({
        where: { id },
      });

      if (!role) {
        throw new NotFoundException(`Role with ID ${id} not found`);
      }

      return role;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to retrieve role');
    }
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    try {
      const existingRole = await this.prisma.role.findUnique({
        where: { id },
      });

      if (!existingRole) {
        throw new NotFoundException(`Role with ID ${id} not found`);
      }

      const role = await this.prisma.role.update({
        where: { id },
        data: updateRoleDto,
      });

      return role;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to update role');
    }
  }

  async remove(id: string) {
    try {
      const existingRole = await this.prisma.role.findUnique({
        where: { id },
      });

      if (!existingRole) {
        throw new NotFoundException(`Role with ID ${id} not found`);
      }

      await this.prisma.role.delete({
        where: { id },
      });

      return { message: 'Role deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to delete role');
    }
  }
}
