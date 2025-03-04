import { Phase } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class PhaseEntity implements Phase {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  phase_name: string;

  @ApiProperty({ nullable: true })
  desc: string;

  @ApiProperty()
  duration: number;

  @ApiProperty()
  size: number;

  @ApiProperty({ format: 'uuid' })
  plant_id: string;
}
