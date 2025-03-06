import { Controller, Post, Body, UseGuards, Req, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local.guard';
import { JwtAuthGuard } from './guards/jwt.guard';
import { Request } from 'express';
import { ApiTags, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiBody({
    schema: {
      example: {
        username: 'user1',
        email: 'user1@gmail.com',
        password: 'password',
      },
    },
  })
  async register(
    @Body() body: { username: string; email: string; password: string },
  ) {
    return this.authService.register(body);
  }

  @Post('login')
  @UseGuards(LocalGuard)
  @ApiBody({
    schema: { example: { usernameOrEmail: 'user1', password: 'password' } },
  })
  async login(@Req() req: Request) {
    return req.user;
  }

  @Get('status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  async status(@Req() req: Request) {
    return req.user;
  }
}
