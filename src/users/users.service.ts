import { Injectable, ConflictException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserDto) {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { username: data.username },
          { email: data.email || undefined },
          { phone_number: data.phone_number || undefined },
        ],
      },
    });

    if (existingUser) {
      if (existingUser.username === data.username) {
        throw new ConflictException('Username already exists');
      }
      if (existingUser.email === data.email) {
        throw new ConflictException('Email already exists');
      }
      if (existingUser.phone_number === data.phone_number) {
        throw new ConflictException('Phone number already exists');
      }
    }

    return this.prisma.user.create({ data });
  }

  findAll() {
    return this.prisma.user.findMany({ where: { is_active: true } });
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
