import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany({ where: { is_active: true } });
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
