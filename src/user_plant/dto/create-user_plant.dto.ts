import { PLANT_SITE, Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  IsUUID,
  IsDateString,
  IsNotEmpty,
  IsObject,
} from 'class-validator';

export class CreateUserPlantDto
  implements Omit<Prisma.User_PlantCreateInput, 'id' | 'created_at'>
{
  @ApiProperty({ required: false, example: 'My Lovely Plant' })
  @IsString()
  @IsOptional()
  nickname?: string;

  @ApiProperty({ default: false, example: true })
  @IsBoolean()
  @IsOptional()
  favorite?: boolean;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  @IsOptional()
  growth_stage?: string;

  @ApiProperty({ default: new Date(), example: '2023-10-20T00:00:00.000Z' })
  @IsDateString()
  @IsOptional()
  planting_date?: Date;

  @ApiProperty({
    type: [String],
    example: ['http://example.com/image1.jpg', 'http://example.com/image2.jpg'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  image_url?: string[];

  @ApiProperty({
    enum: PLANT_SITE,
    default: PLANT_SITE.OUTDOOR,
    example: PLANT_SITE.OUTDOOR,
  })
  @IsNotEmpty()
  plant_site: PLANT_SITE;

  @ApiProperty({
    example: { water: '200ml', fertilizer: '100g', light: '6 hours' },
  })
  @IsObject()
  @IsNotEmpty()
  caring_plant_infor: Prisma.JsonValue;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  @IsNotEmpty()
  plant_id: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  @IsNotEmpty()
  user_id: string;

  @ApiProperty()
  Plant: Prisma.PlantCreateNestedOneWithoutUser_PlantInput;

  @ApiProperty()
  User: Prisma.UserCreateNestedOneWithoutUser_PlantInput;
}
