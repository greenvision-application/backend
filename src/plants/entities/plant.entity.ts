import { ApiProperty } from '@nestjs/swagger';
import {
  Plant,
  DIFFICULTY_LEVEL,
  SOIL_TYPE,
  PLANT_SITE,
  LEVEL,
} from '@prisma/client';

export class PlantEntity implements Plant {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  plant_name: string;

  @ApiProperty({ nullable: true })
  scientific_name: string;

  @ApiProperty()
  overview: string[];

  @ApiProperty()
  characteristic: string[];

  @ApiProperty()
  function: string[];

  @ApiProperty()
  meaning: string[];

  @ApiProperty()
  image_url: string[];

  @ApiProperty()
  difficulty_level: DIFFICULTY_LEVEL;

  @ApiProperty()
  soil_type: SOIL_TYPE;

  @ApiProperty()
  category_id: string;

  @ApiProperty()
  habitatLocation: PLANT_SITE;

  @ApiProperty()
  minTemperature: number;

  @ApiProperty()
  maxTemperature: number;

  @ApiProperty()
  minMatureSize: number;

  @ApiProperty()
  maxMatureSize: number;

  @ApiProperty()
  humidityRange: LEVEL;

  @ApiProperty()
  lightRequirement: LEVEL;
}
