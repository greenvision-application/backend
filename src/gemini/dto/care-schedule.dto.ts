import { ApiProperty } from '@nestjs/swagger';

class CareTaskDto {
  @ApiProperty({
    description: 'Date of the task (YYYY-MM-DD).',
    example: '2024-03-10',
  })
  task_date: string;

  @ApiProperty({
    description: 'Time to perform the task (HH:MM).',
    example: '06:30',
  })
  task_time: string;

  @ApiProperty({
    description: 'Description of the care task.',
    example: 'Water the plant with 200ml of water.',
  })
  content: string;
}

export class CareScheduleDto {
  @ApiProperty({
    description: 'Start date of the care schedule (YYYY-MM-DD).',
    example: '2024-03-01',
  })
  start_date: string;

  @ApiProperty({
    description: 'Name of the plant growth phase.',
    example: 'Nở hoa',
  })
  phase_name: string;

  @ApiProperty({
    description: 'Description of the plant growth phase.',
    example: 'Hoa màu trắng hồng',
  })
  desc: string;

  @ApiProperty({
    description: 'End date of the care schedule (YYYY-MM-DD).',
    example: '2024-04-01',
  })
  end_date: string;

  @ApiProperty({
    description:
      'List of plant care tasks that need to be performed on the schedule.',
    type: [CareTaskDto],
  })
  tasks?: CareTaskDto[];
}
