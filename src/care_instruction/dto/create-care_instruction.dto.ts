import { Prisma, LEVEL } from '@prisma/client';
import { IsJSON, IsOptional, IsUUID, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateCareInstructionDto
  implements Omit<Prisma.Care_instructionCreateInput, 'id' | 'created_at'>
{
  @ApiProperty({ description: 'Water instructions in JSON format' })
  @IsJSON()
  @Transform(({ value }) => JSON.stringify(value))
  water: any;

  @ApiProperty({
    description: 'Sunlight level',
    enum: LEVEL,
    default: LEVEL.MEDIUM,
  })
  @IsEnum(LEVEL)
  sunlight: LEVEL;

  @ApiProperty({
    description: 'Moisture level',
    enum: LEVEL,
    default: LEVEL.MEDIUM,
  })
  @IsEnum(LEVEL)
  moisture: LEVEL;

  @ApiProperty({ description: 'Temperature instructions in JSON format' })
  @IsJSON()
  @Transform(({ value }) => JSON.stringify(value))
  temperature: any;

  @ApiPropertyOptional({
    description: 'Fertilizer instructions in JSON format',
  })
  @IsJSON()
  @IsOptional()
  @Transform(({ value }) => (value ? JSON.stringify(value) : undefined))
  fertilizer?: any;

  @ApiPropertyOptional({ description: 'Pruning instructions in JSON format' })
  @IsJSON()
  @IsOptional()
  @Transform(({ value }) => (value ? JSON.stringify(value) : undefined))
  pruning?: any;

  @ApiPropertyOptional({ description: 'Phase ID in UUID format' })
  @IsUUID()
  @IsOptional()
  phase_id?: string;
}
