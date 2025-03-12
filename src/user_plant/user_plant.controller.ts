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
  UseGuards,
  Req,
  Request,
} from '@nestjs/common';
import { UserPlantService } from './user_plant.service';
import { CreateUserPlantDto } from './dto/create-user_plant.dto';
import { UpdateUserPlantDto } from './dto/update-user_plant.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@/auth/guards/jwt.guard';

@ApiTags('User Plants')
@Controller('user-plant')
export class UserPlantController {
  constructor(private readonly userPlantService: UserPlantService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user plant' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User plant created successfully',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  async create(
    @Request() req: any,
    @Body() createUserPlantDto: CreateUserPlantDto,
  ) {
    return await this.userPlantService.create(createUserPlantDto, req.user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all user plants' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Retrieved all user plants successfully',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async findAll() {
    return await this.userPlantService.findAll();
  }

  @Get('client-schedule')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  async getTimeline(@Req() req: any) {
    return this.userPlantService.findSchedulePlant(req.user?.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user plant by ID' })
  @ApiParam({ name: 'id', description: 'User plant ID (UUID)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Retrieved user plant successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User plant not found',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.userPlantService.findOne(id);
  }

  @Post('test-generate-schedule/:id')
  @ApiOperation({ summary: 'Test generate schedule' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async testGenerateSchedule(@Param('id', ParseUUIDPipe) id: string) {
    return await this.userPlantService.findUserPlantToGenerateSchedule(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user plant' })
  @ApiParam({ name: 'id', description: 'User plant ID (UUID)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User plant updated successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User plant not found',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: any,
    @Body() updateUserPlantDto: UpdateUserPlantDto,
  ) {
    return await this.userPlantService.update(
      id,
      updateUserPlantDto,
      req.user?.id,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user plant' })
  @ApiParam({ name: 'id', description: 'User plant ID (UUID)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User plant deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User plant not found',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.userPlantService.remove(id);
  }

  @Get('get-plant-info/:id')
  @ApiOperation({ summary: 'Get plant information for prompt generation' })
  @ApiParam({ name: 'id', description: 'User plant ID (UUID)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Retrieved plant information successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User plant not found',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async getPlantInfoForPrompt(@Param('id', ParseUUIDPipe) id: string) {
    return await this.userPlantService.findUserPlantToGenerateSchedule(id);
  }
}
