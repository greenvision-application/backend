import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  ParseUUIDPipe,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { PlantsService } from './plants.service';
import { CreatePlantDto } from './dto/create-plant.dto';
import { UpdatePlantDto } from './dto/update-plant.dto';
import { PlantEntity } from './entities/plant.entity';

@Controller('plants')
@ApiTags('Plants')
export class PlantsController {
  constructor(private readonly plantsService: PlantsService) {}

  @Post()
  create(@Body() createPlantDto: CreatePlantDto) {
    return this.plantsService.create(createPlantDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all plants' })
  @ApiOkResponse({
    description: 'List of all plants',
    type: [PlantEntity],
  })
  async findAll() {
    try {
      return await this.plantsService.findAll();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get plant by id' })
  @ApiOkResponse({
    description: 'Plant details',
    type: PlantEntity,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Plant not found',
  })
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    try {
      const plant = await this.plantsService.findOne(id);
      if (!plant) {
        throw new NotFoundException('Plant not found');
      }
      return plant;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update plant by id' })
  @ApiOkResponse({
    description: 'Plant updated successfully',
    type: PlantEntity,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Plant not found',
  })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updatePlantDto: UpdatePlantDto,
  ) {
    try {
      return await this.plantsService.update(id, updatePlantDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete plant by id' })
  @ApiOkResponse({
    description: 'Plant deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Plant not found',
  })
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    try {
      return await this.plantsService.remove(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
