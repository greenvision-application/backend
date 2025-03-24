import { PartialType } from '@nestjs/swagger';
import { CreateCareScheduleDto } from './create-care_schedule.dto';

export class UpdateCareScheduleDto extends PartialType(CreateCareScheduleDto) {}
