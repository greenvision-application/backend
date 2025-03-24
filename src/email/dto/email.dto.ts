import { IsString, IsOptional, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class sendEmailDto {
  @ApiProperty({
    example: ['user1@example.com', 'user2@example.com'],
    description: 'List of email recipients',
  })
  @IsEmail({}, { each: true })
  recipients: string[];

  @ApiProperty({
    example: 'Welcome to our platform',
    description: 'Email subject',
  })
  @IsString()
  subject: string;

  @ApiProperty({
    example: '<h1>Hello</h1><p>This is a test email</p>',
    description: 'HTML content of the email',
  })
  @IsString()
  html: string;

  @ApiProperty({
    example: 'Hello, this is a test email',
    description: 'Plain text content of the email',
    required: false,
  })
  @IsOptional()
  @IsString()
  text?: string;
}
