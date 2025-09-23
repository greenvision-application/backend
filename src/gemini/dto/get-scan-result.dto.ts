import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetAIScanResultDTO {
  @ApiProperty({
    description: 'Image URL for AI to analyze',
    required: true,
    example:
      'https://i2.wp.com/www.spiritualbotany.com/wp-content/uploads/2015/07/lotus-978659_1920-e1465583193321.jpg',
  })
  @IsNotEmpty()
  @IsUrl()
  imageUrl: string;

  @ApiProperty({
    description: 'Session ID for conversation context',
    required: false,
  })
  @IsString()
  @IsOptional()
  sessionId: string;
}

export class PlantHealthReportDto {
  @IsString()
  health_report: string;
}
