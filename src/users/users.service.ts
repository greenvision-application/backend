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

    // Kiểm tra xem username đã tồn tại chưa
    const existingUserByUsername = await this.prisma.user.findUnique({
      where: { username },
    });
    if (existingUserByUsername) {
      throw new Error('Username đã tồn tại');
    }

    // Kiểm tra email đã tồn tại nếu có email
    if (email) {
      const existingUserByEmail = await this.prisma.user.findUnique({
        where: { email },
      });
      if (existingUserByEmail) {
        throw new Error('Email đã tồn tại');
      }
    }

    // Kiểm tra phone_number đã tồn tại nếu có phone_number
    if (phone_number) {
      const existingUserByPhone = await this.prisma.user.findUnique({
        where: { phone_number },
      });
      if (existingUserByPhone) {
        throw new Error('Số điện thoại đã tồn tại');
      }
    }

    // Nếu không có cả email và phone_number thì báo lỗi
    if (!email && !phone_number) {
      throw new Error('bạn chưa điền email hoặc số điện thoại');
    }

    if (!role_id) {
      throw new Error('Bạn chưa chọn role id');
    }

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
