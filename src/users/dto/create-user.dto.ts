import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
  Matches,
  IsUUID,
} from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';
import { Prisma } from '@prisma/client';

export class CreateUserDto
  implements
    Omit<
      Prisma.UserCreateInput,
      'id' | 'created_at' | 'Role' | 'Notification' | 'User_Plant'
    >
{
  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  @Matches(/^[A-Za-z]+$/, {
    message:
      'Username can only contain letters (no numbers or special characters)',
  })
  username?: string;

  @ApiProperty()
  @IsEmail()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  role_id: string;

  @ApiProperty({ required: false, nullable: true, default: null })
  @IsOptional()
  address?: Prisma.InputJsonValue | null;

  @ApiProperty({ required: false, nullable: true, default: null })
  @IsOptional()
  preferences?: Prisma.InputJsonValue | null;

  @ApiProperty({ default: true })
  @IsNotEmpty()
  is_active: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  password?: string;
}
