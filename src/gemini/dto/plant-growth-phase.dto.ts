import { ApiProperty } from '@nestjs/swagger';

class WaterFrequencyDTO {
  @ApiProperty({ description: 'Interval between watering sessions.' })
  interval: number;

  @ApiProperty({
    description: 'Unit of time (day, week, month).',
    enum: ['day', 'week', 'month'],
  })
  unit: string;
}

class WaterDTO {
  @ApiProperty({ description: 'Watering frequency details.' })
  frequency: WaterFrequencyDTO;

  @ApiProperty({ description: 'Amount of water needed.' })
  amount: number;

  @ApiProperty({
    description: 'Unit for water measurement (ml, l).',
    enum: ['ml', 'l'],
  })
  unit: string;
}

class TemperatureDTO {
  @ApiProperty({ description: 'Minimum temperature in this phase.' })
  min: number;

  @ApiProperty({ description: 'Maximum temperature in this phase.' })
  max: number;
}

class FertilizerFrequencyDTO {
  @ApiProperty({ description: 'Interval between fertilization.' })
  interval: number;

  @ApiProperty({
    description: 'Unit of time (day, week, month).',
    enum: ['day', 'week', 'month'],
  })
  unit: string;
}

class FertilizerDTO {
  @ApiProperty({ description: 'Type of fertilizer used in this phase.' })
  type: string;

  @ApiProperty({ description: 'Fertilization frequency details.' })
  frequency: FertilizerFrequencyDTO;
}

class PruningFrequencyDTO {
  @ApiProperty({ description: 'Interval between pruning sessions.' })
  interval: number;

  @ApiProperty({
    description: 'Unit of time (day, week, month).',
    enum: ['day', 'week', 'month'],
  })
  unit: string;
}

class PruningDTO {
  @ApiProperty({ description: 'Pruning frequency details.' })
  frequency: PruningFrequencyDTO;

  @ApiProperty({
    description: 'Reason for pruning the plant during this phase',
  })
  reason: string;
}

class CareInstructionDTO {
  @ApiProperty({ description: 'Watering schedule and details.' })
  water: WaterDTO;

  @ApiProperty({
    description: 'Sunlight requirement level in this phase.',
    enum: ['NONE', 'VERY_LOW', 'LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH'],
  })
  sunlight: string;

  @ApiProperty({
    description: 'Moisture level needed in this phase.',
    enum: ['NONE', 'VERY_LOW', 'LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH'],
  })
  moisture: string;

  @ApiProperty({ description: 'Optimal temperature range (°C).' })
  temperature: TemperatureDTO;

  @ApiProperty({ description: 'Fertilizer application details.' })
  fertilizer: FertilizerDTO;

  @ApiProperty({ description: 'Pruning recommendations.' })
  pruning: PruningDTO;
}

export class PlantGrowthPhaseDTO {
  @ApiProperty({ description: 'Name of the plant growth phase.' })
  phase_name: string;

  @ApiProperty({
    description: 'Description of this growth phase.',
    required: false,
  })
  desc?: string;

  @ApiProperty({ description: 'Size of the plant (cm) at this phase.' })
  size: number;

  @ApiProperty({
    description:
      'Total duration (hours) the plant spends in this growth phase.',
  })
  duration: number;

  @ApiProperty({ description: 'Care instructions for this phase.' })
  care_instruction: CareInstructionDTO;
}
