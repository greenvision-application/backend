import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  NotFoundException,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { CareInstructionService } from './care_instruction.service';
import { CreateCareInstructionDto } from './dto/create-care_instruction.dto';
import { UpdateCareInstructionDto } from './dto/update-care_instruction.dto';

@Controller('care-instruction')
@ApiTags('Care Instructions')
export class CareInstructionController {
  constructor(
    private readonly careInstructionService: CareInstructionService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create care instruction' })
  @ApiOkResponse({
    description: 'Care instruction created successfully',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Failed to create care instruction',
  })
  async create(@Body() createCareInstructionDto: CreateCareInstructionDto) {
    try {
      return await this.careInstructionService.create(createCareInstructionDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all care instructions' })
  @ApiOkResponse({
    description: 'List of all care instructions',
  })
  async findAll() {
    try {
      return await this.careInstructionService.findAll();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get care instruction by id' })
  @ApiOkResponse({
    description: 'Care instruction details',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Care instruction not found',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    try {
      const careInstruction = await this.careInstructionService.findOne(id);
      if (!careInstruction) {
        throw new NotFoundException('Care instruction not found');
      }
      return careInstruction;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update care instruction by id' })
  @ApiOkResponse({
    description: 'Care instruction updated successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Care instruction not found',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCareInstructionDto: UpdateCareInstructionDto,
  ) {
    try {
      return await this.careInstructionService.update(
        id,
        updateCareInstructionDto,
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete care instruction by id' })
  @ApiOkResponse({
    description: 'Care instruction deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Care instruction not found',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    try {
      return await this.careInstructionService.remove(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
