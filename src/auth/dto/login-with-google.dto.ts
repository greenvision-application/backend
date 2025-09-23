import { IsNotEmpty, IsString, IsOptional, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginWithGoogleDto {
  @ApiProperty({
    description: 'JWT token from Appwrite',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  appwriteJWT: string;

  @ApiProperty({
    description: 'Avatar URL of the user',
    example: 'https://example.com/avatar.jpg',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  avatar?: string;
}
