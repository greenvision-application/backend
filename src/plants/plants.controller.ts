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
  findOne(@Param('id') id: string) {
    return this.plantsService.findOne(+id);
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
  remove(@Param('id') id: string) {
    return this.plantsService.remove(+id);
  }
}
