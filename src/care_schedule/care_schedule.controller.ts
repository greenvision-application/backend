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
import { CareScheduleService } from './care_schedule.service';
import { CreateCareScheduleDto } from './dto/create-care_schedule.dto';
import { UpdateCareScheduleDto } from './dto/update-care_schedule.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Care-schedule')
@Controller('care-schedule')
export class CareScheduleController {
  constructor(private readonly careScheduleService: CareScheduleService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new care schedule' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The care schedule has been successfully created.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input or failed to create care schedule.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User plant not found.',
  })
  async create(@Body() createCareScheduleDto: CreateCareScheduleDto) {
    return await this.careScheduleService.create(createCareScheduleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all care schedules' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return all care schedules.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed to fetch care schedules.',
  })
  async findAll() {
    return await this.careScheduleService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a care schedule by id' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return the care schedule.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Care schedule not found.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed to fetch care schedule.',
  })
  async findOne(@Param('id') id: string) {
    return await this.careScheduleService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a care schedule' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The care schedule has been successfully updated.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Care schedule or user plant not found.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input or failed to update care schedule.',
  })
  async update(
    @Param('id') id: string,
    @Body() updateCareScheduleDto: UpdateCareScheduleDto,
  ) {
    return await this.careScheduleService.update(id, updateCareScheduleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a care schedule' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The care schedule has been successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Care schedule not found.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed to delete care schedule.',
  })
  async remove(@Param('id') id: string) {
    return await this.careScheduleService.remove(id);
  }

  @ApiOperation({ summary: 'Generate plant care schedule' })
  @ApiResponse({
    status: 200,
    description: 'Return AI generated plant care schedule',
  })
  @Post(':id')
  promptSchedule(@Param('id', ParseUUIDPipe) id: string) {
    return this.careScheduleService.generateSchedule(id);
  }

  @Get('care-schedule-info/:id')
  @ApiOperation({
    summary: 'Get Care schedule plant information for prompt generation',
  })
  @ApiParam({ name: 'id', description: 'Care schedule plant ID (UUID)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Retrieved CareSchedule information successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Care schedule not found',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async getPlantInfoForPrompt(@Param('id', ParseUUIDPipe) id: string) {
    return await this.careScheduleService.getScheduleInforToPrompt(id);
  }
}
