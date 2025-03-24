import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PrismaService } from '@/prisma/prisma.service';
import { EmailService } from '@/email/email.service';
import { UsersService } from '@/users/users.service';
import keys from 'constants/keys';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: keys.secretJwt,
      signOptions: { expiresIn: '1day' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    PrismaService,
    EmailService,
    UsersService,
  ],
})
export class AuthModule {}
