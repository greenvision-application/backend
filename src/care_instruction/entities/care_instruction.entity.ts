import { LEVEL, Care_instruction } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CareInstructionEntity implements Care_instruction {
  @ApiProperty({ type: String, format: 'uuid' })
  id: string;

  @ApiProperty({ type: Date })
  created_at: Date;

  @ApiProperty({ type: Object })
  water: any;

  @ApiProperty({ enum: LEVEL, default: LEVEL.MEDIUM })
  sunlight: LEVEL;

  @ApiProperty({ enum: LEVEL, default: LEVEL.MEDIUM })
  moisture: LEVEL;

  @ApiProperty({ type: Object })
  temperature: any;

  @ApiProperty({ type: Object, nullable: true })
  fertilizer: any | null;

  @ApiProperty({ type: Object, nullable: true })
  pruning: any | null;

  @ApiProperty({ type: String, nullable: true, format: 'uuid' })
  phase_id: string | null;
}
