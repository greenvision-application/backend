import { ApiProperty } from '@nestjs/swagger';
import { IsUrl, IsNotEmpty, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class UrlImagePlantDto {
  @ApiProperty({
    description: '(Hoa sen) Image URL for AI to analyze',
    required: true,
    example:
      'https://i2.wp.com/www.spiritualbotany.com/wp-content/uploads/2015/07/lotus-978659_1920-e1465583193321.jpg',
  })
  @IsUrl()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  imageUrl: string;

  @ApiProperty({
    description: 'Rose (Hoa hồng) URL example for AI to analyze',
    required: false,
    example:
      'https://images.pexels.com/photos/2300713/pexels-photo-2300713.jpeg',
  })
  @IsUrl()
  @Transform(({ value }) => value?.trim())
  @IsOptional()
  imageUrlExample: string;
}
