import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GeneratePhaseDto {
  @ApiProperty({
    description: 'Name of the plant',
    example: 'Cây cà chua',
  })
  @IsNotEmpty()
  @IsString()
  plant_name: string;

  @ApiProperty({
    description: 'Scientific name of the plant',
    example: 'Solanum lycopersicum',
  })
  @IsNotEmpty()
  @IsString()
  scientific_name: string;
}
