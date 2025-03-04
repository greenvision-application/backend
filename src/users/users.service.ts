import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
// import { CreateUserDto } from './dto/create-user.dto';
import { User } from '@prisma/client';
import { BadRequestException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({
      where: { is_active: true },
      orderBy: { created_at: 'desc' },
    });
  }

  // async createUser(createUserDto: CreateUserDto): Promise<User> {
  //   const {
  //     username,
  //     email,
  //     phone_number,
  //     role_id,
  //     ward_id,
  //     preferences,
  //     is_active,
  //   } = createUserDto;

  //   // Kiểm tra username đã tồn tại
  //   const existingUserByUsername = await this.prisma.user.findUnique({
  //     where: { username },
  //   });
  //   if (existingUserByUsername) {
  //     throw new BadRequestException('Username đã tồn tại');
  //   }

  //   // Kiểm tra email đã tồn tại nếu có email
  //   if (email) {
  //     const existingUserByEmail = await this.prisma.user.findUnique({
  //       where: { email },
  //     });
  //     if (existingUserByEmail) {
  //       throw new BadRequestException('Email đã tồn tại');
  //     }
  //   }

  //   // Kiểm tra phone_number đã tồn tại nếu có phone_number
  //   if (phone_number) {
  //     const existingUserByPhone = await this.prisma.user.findUnique({
  //       where: { phone_number },
  //     });
  //     if (existingUserByPhone) {
  //       throw new BadRequestException('Số điện thoại đã tồn tại');
  //     }
  //   }

  //   // Nếu không có cả email và phone_number thì báo lỗi
  //   if (!email && !phone_number) {
  //     throw new BadRequestException('Bạn chưa điền email hoặc số điện thoại');
  //   }

  //   if (!role_id) {
  //     throw new BadRequestException('Bạn chưa chọn role id');
  //   }

  //   return this.prisma.user.create({
  //     data: {
  //       username,
  //       email,
  //       phone_number,
  //       role_id,
  //       ward_id,
  //       preferences,
  //       is_active,
  //     },
  //   });
  // }

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

  /*************  ✨ Codeium Command ⭐  *************/
  /**
   * Update a user by its id
   *
   * @param id ID of the user to be updated
   * @param updateUserDto Data to be updated
   * @returns The updated user
   * @throws {NotFoundException} if the user with the given id does not exist
   */
  /******  57870a8b-0474-4e8d-b4b7-a5be59d18391  *******/
  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const { username, email, phone_number } = updateUserDto;

    // Kiểm tra username đã tồn tại (ngoại trừ user hiện tại)
    if (username) {
      const existingUserByUsername = await this.prisma.user.findUnique({
        where: { username },
      });
      if (existingUserByUsername && existingUserByUsername.id !== id) {
        throw new BadRequestException('Username đã tồn tại');
      }
    }

    // Kiểm tra email đã tồn tại (ngoại trừ user hiện tại)
    if (email) {
      const existingUserByEmail = await this.prisma.user.findUnique({
        where: { email },
      });
      if (existingUserByEmail && existingUserByEmail.id !== id) {
        throw new BadRequestException('Email đã tồn tại');
      }
    }

    // Kiểm tra phone_number đã tồn tại (ngoại trừ user hiện tại)
    if (phone_number) {
      const existingUserByPhone = await this.prisma.user.findUnique({
        where: { phone_number },
      });
      if (existingUserByPhone && existingUserByPhone.id !== id) {
        throw new BadRequestException('Số điện thoại đã tồn tại');
      }
    }

    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }
}
