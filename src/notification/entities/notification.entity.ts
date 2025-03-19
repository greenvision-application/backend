import { Notification, NOTIFICATION_STATUS } from '@prisma/client';

export class NotificationEntity implements Notification {
  id: string;
  created_at: Date;
  content: string;
  send_time: Date;
  status: NOTIFICATION_STATUS;
  user_id: string;
}
