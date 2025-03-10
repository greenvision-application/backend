import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class AuthPayloadDto {
  @ApiProperty({
    description: 'Username of the user',
    required: false,
    example: 'Kai',
  })
  username?: string;

  @ApiProperty({
    description: 'Password of the user',
    required: false,
    example: 'password123!',
  })
  password?: string;

  @ApiProperty({
    description: 'Email of the user',
    required: true,
    example: 'kai@example.com',
  })
  @IsEmail()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Role ID of the user',
    required: false,
    example: '7a824cc3-5bc8-4bc6-a03d-1d4541782134',
  })
  role_id?: string;
}
