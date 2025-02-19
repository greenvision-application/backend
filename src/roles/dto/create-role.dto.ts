import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';
import { Prisma } from '@prisma/client';

export class CreateRoleDto
  implements Omit<Prisma.RoleCreateInput, 'id' | 'created_at'>
{
  @ApiProperty({ description: 'role name' })
  @IsString()
  @IsNotEmpty({ message: 'role name is not empty' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Matches(/^[A-Za-z]+$/, {
    message: 'Username chỉ được chứa chữ cái (không có số hoặc ký tự đặc biệt)',
  })
  role_name: string;
}
