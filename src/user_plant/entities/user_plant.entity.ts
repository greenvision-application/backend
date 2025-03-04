import { User_Plant, PLANT_SITE } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UserPlantEntity implements User_Plant {
  @ApiProperty({ description: 'UUID of the user plant', format: 'uuid' })
  id: string;

  @ApiProperty({ description: 'Creation timestamp' })
  created_at: Date;

  @ApiProperty({ description: 'Nickname of the plant', required: false })
  nickname: string;

  @ApiProperty({
    description: 'Whether the plant is favorited',
    default: false,
  })
  favorite: boolean;

  @ApiProperty({ description: 'Growth stage UUID' })
  growth_stage: string;

  @ApiProperty({ description: 'Planting date' })
  planting_date: Date;

  @ApiProperty({ description: 'Array of image URLs', type: [String] })
  image_url: string[];

  @ApiProperty({ description: 'Plant site location', enum: PLANT_SITE })
  plant_site: PLANT_SITE;

  @ApiProperty({ description: 'Plant care information' })
  caring_plant_infor: any;

  @ApiProperty({ description: 'Plant UUID', format: 'uuid' })
  plant_id: string;

  @ApiProperty({ description: 'User UUID', format: 'uuid' })
  user_id: string;
}
