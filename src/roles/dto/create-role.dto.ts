import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';
import { Prisma } from '@prisma/client';

export class CreateRoleDto
  implements Omit<Prisma.RoleCreateInput, 'id' | 'created_at'>
{
  @ApiProperty({ description: 'role name' })
  @IsString()
  @IsNotEmpty({ message: 'role name is not empty' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  role_name: string;
}
