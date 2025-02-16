import { ApiProperty } from '@nestjs/swagger';
import { Task, TASK_STATUS } from '@prisma/client';

export class TaskEntity implements Task {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  content: string;

  @ApiProperty()
  task_time: Date;

  @ApiProperty()
  completion_status: TASK_STATUS;

  @ApiProperty()
  task_date: Date;

  @ApiProperty({
    format: 'uuid',
    nullable: true,
  })
  care_schedule_id: string;
}
