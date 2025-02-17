import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({
      where: { is_active: true },
      orderBy: { created_at: 'desc' },
    });
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const {
      username,
      email,
      phone_number,
      role_id,
      ward_id,
      preferences,
      is_active,
    } = createUserDto;

    return this.prisma.user.create({
      data: {
        username,
        email,
        phone_number,
        role_id,
        ward_id,
        preferences,
        is_active,
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.prisma.user.update({
      where: { id },
      data: { is_active: false },
    });
  }
}
