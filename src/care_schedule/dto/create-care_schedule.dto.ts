import { Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, IsDateString } from 'class-validator';

export class CreateCareScheduleDto
  implements Omit<Prisma.Care_ScheduleCreateInput, 'id' | 'created_at'>
{
  @ApiProperty({
    description: 'Start date of the care schedule',
    example: new Date(),
  })
  @IsNotEmpty()
  @IsDateString()
  start_date: Date;
  @ApiProperty({
    description: 'End date of the care schedule',
    example: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
  })
  @IsNotEmpty()
  @IsDateString()
  end_date: Date;
  @ApiProperty({
    description: 'ID of the user plant',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsUUID()
  user_plant_id: string;

  User_Plant: Prisma.User_PlantCreateNestedOneWithoutCare_ScheduleInput;
}
