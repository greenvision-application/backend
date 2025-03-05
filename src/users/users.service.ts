import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { User } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<User[]> {
    try {
      return await this.prisma.user.findMany({
        where: { is_active: true },
        orderBy: { created_at: 'desc' },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'Failed to retrieve users',
      );
    }
  }

  async findOne(id: string): Promise<User> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to retrieve user');
    }
  }

  async remove(id: string): Promise<User> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      return await this.prisma.user.update({
        where: { id },
        data: { is_active: false },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to deactivate user');
    }
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      const { username, email, phone_number } = updateUserDto;

      if (username) {
        const existingUserByUsername = await this.prisma.user.findUnique({
          where: { username },
        });
        if (existingUserByUsername && existingUserByUsername.id !== id) {
          throw new BadRequestException('Username is already taken');
        }
      }

      if (email) {
        const existingUserByEmail = await this.prisma.user.findUnique({
          where: { email },
        });
        if (existingUserByEmail && existingUserByEmail.id !== id) {
          throw new BadRequestException('Email is already registered');
        }
      }

      if (phone_number) {
        const existingUserByPhone = await this.prisma.user.findUnique({
          where: { phone_number },
        });
        if (existingUserByPhone && existingUserByPhone.id !== id) {
          throw new BadRequestException('Phone number is already registered');
        }
      }

      return await this.prisma.user.update({
        where: { id },
        data: updateUserDto,
      });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update user');
    }
  }

  async createUser(createUserDto: {
    username: string;
    email?: string;
    phone_number?: string;
    role_id: string;
    preferences?: any;
    address: any;
    is_active?: boolean;
  }): Promise<User> {
    try {
      const { username, email, phone_number, role_id } = createUserDto;

      if (!email && !phone_number) {
        throw new BadRequestException('Email or phone number is required');
      }

      if (!role_id) {
        throw new BadRequestException('Role ID is required');
      }

      const existingUserByUsername = await this.prisma.user.findUnique({
        where: { username },
      });
      if (existingUserByUsername) {
        throw new BadRequestException('Username is already taken');
      }

      if (email) {
        const existingUserByEmail = await this.prisma.user.findUnique({
          where: { email },
        });
        if (existingUserByEmail) {
          throw new BadRequestException('Email is already registered');
        }
      }

      if (phone_number) {
        const existingUserByPhone = await this.prisma.user.findUnique({
          where: { phone_number },
        });
        if (existingUserByPhone) {
          throw new BadRequestException('Phone number is already registered');
        }
      }

      return await this.prisma.user.create({
        data: createUserDto,
      });
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create user');
    }
  }
}
