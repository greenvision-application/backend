import {
  Injectable,
  BadRequestException,
  ConflictException,
  UnauthorizedException,
  InternalServerErrorException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { AuthPayloadDto } from './dto/auth.dto';
import variables from 'constants/variables';
import { EmailService } from '@/email/email.service';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { UsersService } from '@/users/users.service';

@Injectable()
export class AuthService {
  private otpStore = new Map();
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailSerVice: EmailService,
    private userService: UsersService,
  ) {}

  generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async register({ email }: AuthPayloadDto) {
    try {
      if (!email) {
        throw new BadRequestException('Email is required');
      }

      const existingUser = await this.prisma.user.findFirst({
        where: { email },
      });

      if (existingUser) {
        throw new ConflictException('Email already exists');
      }

      const otp = this.generateOTP();
      this.otpStore.set(email, { otp, expires: Date.now() + 60 * 1000 });

      await this.emailSerVice.sendOTP(email, otp);
      return { message: 'OTP code has been sent to your email' };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to register user');
    }
  }

  async validateUser({ username, email, password }: AuthPayloadDto) {
    try {
      if (!password) {
        throw new BadRequestException('Password is required');
      }

      if (!username && !email) {
        throw new BadRequestException('Username or email is required');
      }

      const user = await this.prisma.user.findFirst({
        where: { OR: [{ username }, { email }] },
      });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new UnauthorizedException('Invalid credentials');
      }
      if (!user.is_active) {
        throw new ForbiddenException('User account is inactive');
      }

      const payload = {
        id: user.id,
        username: user.username,
        email: user.email,
        role_id: user.role_id,
      };
      return this.jwtService.sign(payload);
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof UnauthorizedException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to validate user');
    }
  }

  async verifyOTP(verifyOtpDto: VerifyOtpDto) {
    try {
      if (!verifyOtpDto.email || !verifyOtpDto.otp || !verifyOtpDto.password) {
        throw new BadRequestException('Email, OTP and password are required');
      }

      const otpData = this.otpStore.get(verifyOtpDto.email);

      if (!otpData || otpData.expires < Date.now()) {
        throw new BadRequestException('Invalid or expired OTP code');
      }

      if (otpData.otp !== verifyOtpDto.otp) {
        throw new BadRequestException('Incorrect OTP code');
      }

      const hashedPassword = await bcrypt.hash(verifyOtpDto.password, 10);

      await this.userService.createUser({
        email: verifyOtpDto.email,
        role_id: variables.user_role,
        password: hashedPassword,
        is_active: true,
      });

      this.otpStore.delete(verifyOtpDto.email);

      return { message: 'Registration successful' };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to verify OTP');
    }
  }
}
