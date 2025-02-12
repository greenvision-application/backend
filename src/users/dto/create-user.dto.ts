import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsPhoneNumber,
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
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  ward_id?: string;

  @ApiProperty({ required: false, default: null })
  @IsOptional()
  preferences?: Prisma.InputJsonValue;

  @ApiProperty({ default: true })
  @IsNotEmpty()
  is_active: boolean;
}
