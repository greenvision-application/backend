import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsPhoneNumber,
  Matches,
} from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';
import { Prisma } from '@prisma/client';

export class CreateUserDto
  implements Omit<Prisma.UserCreateInput, 'id' | 'created_at' | 'Role'>
{
  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  @Matches(/^[A-Za-z]+$/, {
    message: 'Username chỉ được chứa chữ cái (không có số hoặc ký tự đặc biệt)',
  })
  username: string;

  @ApiProperty({ required: false, default: null })
  @IsEmail()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsOptional()
  email?: string;

  @ApiProperty({ required: false, default: null })
  @IsPhoneNumber()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  @IsOptional()
  phone_number?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  role_id: string;

  @ApiProperty({ required: false, default: null })
  @IsOptional()
  address: Prisma.InputJsonValue;

  @ApiProperty({ required: false, default: null })
  @IsOptional()
  preferences?: Prisma.InputJsonValue;

  @ApiProperty({ default: true })
  @IsNotEmpty()
  is_active: boolean;
}
