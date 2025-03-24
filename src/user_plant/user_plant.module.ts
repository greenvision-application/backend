import { Module } from '@nestjs/common';
import { UserPlantService } from './user_plant.service';
import { UserPlantController } from './user_plant.controller';
import { PrismaService } from '@/prisma/prisma.service';

@Module({
  controllers: [UserPlantController],
  providers: [UserPlantService, PrismaService],
  exports: [UserPlantService],
})
export class UserPlantModule {}
