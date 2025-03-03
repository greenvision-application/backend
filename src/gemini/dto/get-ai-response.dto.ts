import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetAIMessageDTO {
  @ApiProperty({
    description: 'The prompt message for AI',
    example:
      'Đưa cho tôi đặc điểm, công dụng, chức năng, và tổng quan của thực vậy trong hình ảnh này',
  })
  @IsString()
  @IsNotEmpty()
  prompt: string;

  @ApiProperty({
    description: 'Session ID for conversation context',
    required: false,
  })
  @IsString()
  @IsOptional()
  sessionId: string;

  @ApiProperty({
    description: 'Image URL for AI to analyze',
    required: false,
    example:
      'https://i2.wp.com/www.spiritualbotany.com/wp-content/uploads/2015/07/lotus-978659_1920-e1465583193321.jpg',
  })
  @IsUrl()
  @IsOptional()
  imageUrl?: string;
}
