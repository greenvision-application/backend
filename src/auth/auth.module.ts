import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PrismaService } from '@/prisma/prisma.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: '4titan-gv',
      signOptions: { expiresIn: '1day' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, PrismaService],
})
export class AuthModule {}
