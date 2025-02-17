import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsUUID,
} from 'class-validator';
import { Transform } from 'class-transformer';
import {
  Prisma,
  SOIL_TYPE,
  LEVEL,
  DIFFICULTY_LEVEL,
  PLANT_SITE,
} from '@prisma/client';

export class CreatePlantDto
  implements Omit<Prisma.PlantCreateInput, 'id' | 'created_at' | 'Category'>
{
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  plant_name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  scientific_name?: string;

  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }) =>
    Array.isArray(value)
      ? value.map((item: string) =>
          typeof item === 'string' ? item.trim() : item,
        )
      : value,
  )
  overview: string[];

  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }) =>
    Array.isArray(value)
      ? value.map((item: string) =>
          typeof item === 'string' ? item.trim() : item,
        )
      : value,
  )
  characteristic: string[];

  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }) =>
    Array.isArray(value)
      ? value.map((item: string) =>
          typeof item === 'string' ? item.trim() : item,
        )
      : value,
  )
  function: string[];

  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }) =>
    Array.isArray(value)
      ? value.map((item: string) =>
          typeof item === 'string' ? item.trim() : item,
        )
      : value,
  )
  meaning: string[];

  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }) =>
    Array.isArray(value)
      ? value.map((item: string) =>
          typeof item === 'string' ? item.trim() : item,
        )
      : value,
  )
  image_url: string[];

  @ApiProperty({ default: DIFFICULTY_LEVEL.MEDIUM })
  @IsEnum(DIFFICULTY_LEVEL, { message: 'Invalid difficulty level' })
  @IsNotEmpty()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  difficulty_level: DIFFICULTY_LEVEL;

  @ApiProperty({ default: SOIL_TYPE.CLAY })
  @IsEnum(SOIL_TYPE, { message: 'Invalid soil type' })
  @IsNotEmpty()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  soil_type: SOIL_TYPE;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  category_id: string;

  @ApiProperty({ default: PLANT_SITE.OUTDOOR })
  @IsEnum(PLANT_SITE, { message: 'Invalid plant site' })
  @IsNotEmpty()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  habitatLocation: PLANT_SITE;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  minTemperature: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  maxTemperature: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  minMatureSize: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  maxMatureSize: number;

  @ApiProperty({ default: LEVEL.MEDIUM })
  @IsEnum(LEVEL, { message: 'Invalid humidity range' })
  @IsNotEmpty()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  humidityRange: LEVEL;

  @ApiProperty({ default: LEVEL.MEDIUM })
  @IsEnum(LEVEL, { message: 'Invalid lighting requirements' })
  @IsNotEmpty()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  lightRequirement: LEVEL;
}
