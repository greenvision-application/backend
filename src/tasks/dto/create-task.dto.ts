import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
  IsUUID,
} from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';
import { Prisma, TASK_STATUS } from '@prisma/client';

export class CreateTaskDto
  implements Omit<Prisma.TaskCreateInput, 'id' | 'created_at'>
{
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  content: string;

  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }) => new Date(`1970-01-01T${value}`))
  task_time: Date;

  @ApiProperty({ default: TASK_STATUS.DO })
  @IsEnum(TASK_STATUS, { message: 'Invalid completion status' })
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  completion_status: TASK_STATUS;

  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  task_date: Date;

  @ApiProperty({ required: false, default: null })
  @IsOptional()
  @IsUUID()
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  care_schedule_id?: string;
}
