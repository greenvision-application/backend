import { Module } from '@nestjs/common';
import { PlantsService } from './plants.service';
import { PlantsController } from './plants.controller';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  controllers: [PlantsController],
  providers: [PlantsService],
  imports: [PrismaModule],
})
export class PlantsModule {}
