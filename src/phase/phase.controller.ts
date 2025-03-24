import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { PhaseService } from './phase.service';
import { CreatePhaseDto } from './dto/create-phase.dto';
import { UpdatePhaseDto } from './dto/update-phase.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Phases')
@Controller('phase')
export class PhaseController {
  constructor(private readonly phaseService: PhaseService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new phase' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Phase created successfully',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async create(@Body() createPhaseDto: CreatePhaseDto) {
    try {
      return await this.phaseService.create(createPhaseDto);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all phases' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return all phases' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async findAll() {
    try {
      return await this.phaseService.findAll();
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a phase by id' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return the phase' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Phase not found' })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid UUID format',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    try {
      return await this.phaseService.findOne(id);
    } catch (error) {
      throw error;
    }
  }

  @Get('plant-phase/:id')
  @ApiOperation({ summary: 'Get a phase by id of plant' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return the phase' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Phase not found' })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid UUID format',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async getPlantPhase(@Param('id', ParseUUIDPipe) id: string) {
    try {
      return await this.phaseService.findAllForClient(id);
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a phase' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Phase updated successfully',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Phase not found' })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request or Invalid UUID format',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePhaseDto: UpdatePhaseDto,
  ) {
    try {
      return await this.phaseService.update(id, updatePhaseDto);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a phase' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Phase deleted successfully',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Phase not found' })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid UUID format',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    try {
      return await this.phaseService.remove(id);
    } catch (error) {
      throw error;
    }
  }
}
