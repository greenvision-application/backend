import { Prisma } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsUUID, IsOptional } from 'class-validator';

export class CreatePhaseDto
  implements
    Omit<Prisma.PhaseCreateInput, 'id' | 'created_at' | ' Care_instruction'>
{
  Care_instruction?: Prisma.Care_instructionCreateNestedOneWithoutPhaseInput;
  Plant: Prisma.PlantCreateNestedOneWithoutPhaseInput;
  @ApiProperty({ description: 'Phase name', example: 'Seedling' })
  @IsString()
  phase_name: string;

  @ApiPropertyOptional({ description: 'Phase description' })
  @IsString()
  @IsOptional()
  desc?: string;

  @ApiProperty({ description: 'Duration in days', example: 30 })
  @IsNumber()
  duration: number;

  @ApiProperty({
    description: 'Size of the plant in this phase',
    example: 10.5,
  })
  @IsNumber()
  size: number;

  @ApiProperty({
    description: 'Plant ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  plant_id: string;
}
