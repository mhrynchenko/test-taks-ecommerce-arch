// THIS IS ADDED HERE ONLY FOR SIMPLISITY 
// This client should come as a common library that should be added to package.json

export enum NotificationChannel {
  EMAIL = 'email',
  PUSH = 'push',
};

export type NotificationChannels = NotificationChannel.EMAIL | NotificationChannel.PUSH;

export type NotificationParams = {
  channels: NotificationChannels[];
  message: string;
  metadata: any;
};

export const sendNotification = (notification: NotificationParams) => {};
