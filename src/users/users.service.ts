import { Injectable } from '@nestjs/common';
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

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
