import { Controller, Post, Body, UseGuards, Req, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local.guard';
import { JwtAuthGuard } from './guards/jwt.guard';
import { Request } from 'express';
import { ApiTags, ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { AuthPayloadDto } from './dto/auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register new user account' })
  async register(@Body() body: AuthPayloadDto) {
    return this.authService.register(body);
  }

  @Post('login')
  @UseGuards(LocalGuard)
  @ApiOperation({ summary: 'Login with username/email and password' })
  @ApiBody({
    schema: { example: { usernameOrEmail: 'user1', password: 'password' } },
  })
  async login(@Req() req: Request) {
    return req.user;
  }

  @Get('status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get current user status' })
  async status(@Req() req: Request) {
    return req.user;
  }

  @Post('verify-otp')
  @ApiOperation({ summary: 'Verify OTP code' })
  async verifyOTP(@Body() body: VerifyOtpDto) {
    return this.authService.verifyOTP(body);
  }
}
