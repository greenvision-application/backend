import { ApiProperty } from '@nestjs/swagger';
import { Care_Schedule } from '@prisma/client';

export class CareScheduleEntity implements Care_Schedule {
  @ApiProperty({
    description: 'The unique identifier of the care schedule',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({ description: 'The creation timestamp of the care schedule' })
  created_at: Date;

  @ApiProperty({ description: 'The start date of the care schedule' })
  start_date: Date;

  @ApiProperty({ description: 'The description of the care schedule' })
  desc: string;

  @ApiProperty({ description: 'The phase name  of the care schedule' })
  phase_name: string;

  @ApiProperty({ description: 'The end date of the care schedule' })
  end_date: Date;

  @ApiProperty({
    description: 'The ID of the associated user plant',
    format: 'uuid',
  })
  user_plant_id: string;
}
