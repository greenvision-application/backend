import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';

export class UserEntity implements User {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  username: string;

  @ApiProperty({ nullable: true })
  email: string;

  @ApiProperty({ nullable: true })
  phone_number: string;

  @ApiProperty({ format: 'uuid' })
  role_id: string;

  @ApiProperty({ format: 'uuid', nullable: true })
  ward_id: string;

  @ApiProperty({ nullable: true })
  preferences: any;

  @ApiProperty({ default: true })
  is_active: boolean;
}
