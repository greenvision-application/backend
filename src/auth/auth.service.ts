import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { AuthPayloadDto } from './dto/auth.dto';
import variables from 'constants/variables';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register({ username, email, password, role_id }: AuthPayloadDto) {
    const existingUser = await this.prisma.user.findFirst({
      where: { OR: [{ username }, { email }] },
    });

    if (existingUser) {
      throw new BadRequestException('Username or email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role_id: role_id ?? variables.user_role,
      },
    });

    return { message: 'User registered successfully', user };
  }

  async validateUser({ username, email, password }: AuthPayloadDto) {
    const user = await this.prisma.user.findFirst({
      where: { OR: [{ username }, { email }] },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
      role_id: user.role_id,
    };
    return this.jwtService.sign(payload);
  }
}
