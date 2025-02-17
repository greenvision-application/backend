import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreatePlantDto } from './dto/create-plant.dto';
// import { UpdatePlantDto } from './dto/update-plant.dto';

@Injectable()
export class PlantsService {
  constructor(private prisma: PrismaService) {}
  create(plantData: CreatePlantDto) {
    return this.prisma.plant.create({ data: plantData });
  }

  findAll() {
    return `This action returns all plants`;
  }

  findOne(id: number) {
    return `This action returns a #${id} plant`;
  }

  // update(id: number, updatePlantDto: UpdatePlantDto) {
  //   return `This action updates a #${id} plant`;
  // }

  remove(id: number) {
    return `This action removes a #${id} plant`;
  }
}
