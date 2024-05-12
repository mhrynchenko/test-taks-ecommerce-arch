import type { APIGatewayEvent } from 'aws-lambda';
import middy from '@middy/core';
import middyJsonBodyParser from '@middy/http-json-body-parser';
import eventNormalizer from '@middy/event-normalizer';
import { DynamoDBClient, sendNotification, NotificationChannel } from '@libs/index';
import { StripeWebhookAdapter } from './adapter'; 
 
const webhookProcessor = async (event: APIGatewayEvent) => {
  const paymentRecord = new StripeWebhookAdapter(event);
  const ddbClient = new DynamoDBClient();

  try {
    await ddbClient.update(paymentRecord);
  } catch (error) {
    console.error(`Failed to save payment`, error);
  }

  sendNotification({
    message: 'Payed successfully.',
    channels: [NotificationChannel.EMAIL, NotificationChannel.PUSH],
    metadata: {
      order_id: paymentRecord.order_id,
    },
  });
};

export const main = middy(webhookProcessor)
  .use(middyJsonBodyParser())
  .use(eventNormalizer());
