import { ApiProperty } from '@nestjs/swagger';

export class PlantResponseDTO {
  @ApiProperty({ description: 'Common name of the plant.' })
  plant_name: string;

  @ApiProperty({
    description: 'Scientific name of the plant.',
    required: false,
  })
  scientific_name?: string;

  @ApiProperty({
    description: 'General description of the plant.',
    type: [String],
  })
  overview: string[];

  @ApiProperty({
    description: 'Key characteristics of the plant.',
    type: [String],
  })
  characteristic: string[];

  @ApiProperty({
    description: 'Uses or functions of the plant.',
    type: [String],
  })
  function: string[];

  @ApiProperty({
    description: 'Symbolic meanings of the plant.',
    type: [String],
  })
  meaning: string[];

  @ApiProperty({
    description: 'Preferred soil type of the plant.',
    required: false,
  })
  soil_type?: string;

  @ApiProperty({
    description: 'Difficulty level of growing the plant.',
    required: false,
  })
  difficulty_level?: string;

  @ApiProperty({ description: 'Required light level.', required: false })
  lightRequirement?: string;

  @ApiProperty({ description: 'Optimal humidity level.', required: false })
  humidityRange?: string;

  @ApiProperty({
    description: 'Minimum temperature (°C) the plant can tolerate.',
    required: false,
  })
  minTemperature?: number;

  @ApiProperty({
    description: 'Maximum temperature (°C) the plant can tolerate.',
    required: false,
  })
  maxTemperature?: number;

  @ApiProperty({
    description: 'Minimum mature size (cm) of the plant.',
    required: false,
  })
  minMatureSize?: number;

  @ApiProperty({
    description: 'Maximum mature size (cm) of the plant.',
    required: false,
  })
  maxMatureSize?: number;

  @ApiProperty({
    description: 'URLs of plant images.',
    type: [String],
    required: false,
  })
  image_url?: string[];

  @ApiProperty({
    description: 'Search query used to find the plant on Unsplash.',
    required: false,
  })
  searchQuery?: string;
}
