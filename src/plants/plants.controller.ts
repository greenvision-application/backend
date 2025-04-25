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
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { PlantsService } from './plants.service';
import { CreatePlantDto } from './dto/create-plant.dto';
import { UpdatePlantDto } from './dto/update-plant.dto';
import { PlantEntity } from './entities/plant.entity';
import { UrlImagePlantDto } from './dto/url-image-plant.dto';
import { GeneratePhaseDto } from './dto/generate-phase.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt.guard';
import { PlantRecommendationService } from './plant-recommendation.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from '@/file-upload/file-upload.service';

@Controller('plants')
@ApiTags('Plants')
export class PlantsController {
  constructor(
    private readonly plantsService: PlantsService,
    private readonly plantRecommendation: PlantRecommendationService,
    private readonly uploadFileService: FileUploadService,
  ) {}

  @Post()
  create(@Body() createPlantDto: CreatePlantDto) {
    return this.plantsService.create(createPlantDto);
  }

  @ApiOperation({ summary: 'Scan plant from image file' })
  @ApiOkResponse({
    description: 'Plant identification result',
    type: PlantEntity,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Failed to scan plant',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Image file to upload',
    type: 'multipart/form-data',
    required: true,
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Post('scan')
  @UseInterceptors(FileInterceptor('file'))
  async scanPlant(@UploadedFile() file: Express.Multer.File) {
    try {
      const uploadResult =
        await this.uploadFileService.handleFileUploadToGoogle(file);
      return await this.plantsService.scanFilePlant(
        uploadResult.fileUri,
        uploadResult.mimeType,
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOperation({ summary: 'Scan plant from image URL' })
  @ApiOkResponse({
    description: 'Plant identification result',
    type: PlantEntity,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Failed to scan plant',
  })
  @Post('scan/url')
  async scanUrlPlant(@Body() data: UrlImagePlantDto) {
    try {
      return await this.plantsService.scanUrlPlant(data.imageUrl);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
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

  @Get('client-plants')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  async getAllPlants(@Req() req: any) {
    return this.plantsService.findAllForClient(req.user?.id);
  }

  @Get('recommendations')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get 6 recommendations' })
  async getRecommendedPlants(@Req() req: any) {
    const recommendations =
      await this.plantRecommendation.recommendSimilarPlants(req.user?.id);
    return recommendations;
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

  @Post('generate-phase/:id')
  @ApiOperation({ summary: 'Generate phase of plant' })
  @ApiOkResponse({
    description: 'Phase of plant generated successfully',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Failed to generate phase of plant',
  })
  async generatePhase(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() generatePhaseDto: GeneratePhaseDto,
  ) {
    try {
      return await this.plantsService.createPlantPhaseWithAI(
        generatePhaseDto.plant_name,
        generatePhaseDto.scientific_name,
        id,
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
