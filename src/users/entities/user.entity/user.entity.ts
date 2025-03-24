import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';

export class UserEntity implements User {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  username: string;

  @ApiProperty()
  password: string;

  @ApiProperty({ nullable: true })
  email: string;

  @ApiProperty({ format: 'uuid' })
  role_id: string;

  @ApiProperty({ nullable: true })
  address: any;
  @ApiProperty({ nullable: true })
  pushToken: string;

  @ApiProperty({ nullable: true })
  preferences: any;

  @ApiProperty({ default: true })
  is_active: boolean;
}
