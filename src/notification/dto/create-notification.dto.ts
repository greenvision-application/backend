import { Prisma, NOTIFICATION_STATUS } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUUID, IsEnum } from 'class-validator';

export class CreateNotificationDto
  implements Omit<Prisma.NotificationCreateInput, 'id' | 'created_at'>
{
  @ApiProperty({
    description: 'Content of the notification',
    example: 'You have a new message',
  })
  @IsString()
  content: string;

  @ApiProperty({
    description: 'Send time of the notification',
    required: false,
    example: '2024-01-20T10:30:00Z',
  })
  @IsOptional()
  send_time?: string;

  @ApiProperty({
    description: 'Status of the notification',
    enum: NOTIFICATION_STATUS,
    default: NOTIFICATION_STATUS.PENDING,
    example: NOTIFICATION_STATUS.PENDING,
  })
  @IsOptional()
  @IsEnum(NOTIFICATION_STATUS)
  status?: NOTIFICATION_STATUS;

  @ApiProperty({
    description: 'User ID associated with notification',
    required: false,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID()
  user_id?: string;
}
