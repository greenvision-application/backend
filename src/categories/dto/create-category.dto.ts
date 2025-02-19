import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';
import { Prisma } from '@prisma/client';

export class CreateCategoryDto
  implements Omit<Prisma.CategoryCreateInput, 'id' | 'created_at'>
{
  @ApiProperty({ description: 'Category name' })
  @IsString()
  @IsNotEmpty({ message: 'category name is not empty' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Matches(/^[A-Za-z]+$/, {
    message:
      'Categoryname chỉ được chứa chữ cái (không có số hoặc ký tự đặc biệt)',
  })
  category_name: string;
}
