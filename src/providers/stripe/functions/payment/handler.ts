import type { APIGatewayEvent } from 'aws-lambda';
import middy from '@middy/core';
import validator from '@middy/validator';
import { transpileSchema } from '@middy/validator/transpile';
import middyJsonBodyParser from '@middy/http-json-body-parser';
import eventNormalizer from '@middy/event-normalizer';
import { schema } from './schema';
import { StripePaymentProvider } from './payment_provider';
import { DynamoDBClient } from '@libs/index';
import { StripePaymentAdapter } from './adapter'; 

const paymentProcessor = async (event: APIGatewayEvent) => {
  const provider = new StripePaymentProvider<StripePaymentAdapter>();
  const paymentRecord = new StripePaymentAdapter(event.body);

  const isPaymentRequestSent = await provider.pay(paymentRecord);

  if (!isPaymentRequestSent) {
    const message = `Failed to send a payment request for order with id '${paymentRecord.order_id}'`;
    console.error(message);
    return {
      statusCode: 400,
      body: JSON.stringify({
        message,
        event,
      }),
    }
  }

  const ddbClient = new DynamoDBClient();

  try {
    await ddbClient.put(paymentRecord);
  } catch (error) {
    await provider.cancel(paymentRecord.order_id);
    const message = `Failed to save payment request for order with id '${paymentRecord.order_id}' to DDB`;
    console.error(message);
    return {
      statusCode: 400,
      body: JSON.stringify({
        message,
        event,
      }),
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Payment for order with id '${paymentRecord.order_id}' is sent to stripe.`,
      event,
    }),
  };
};

export const main = middy(paymentProcessor)
  .use(middyJsonBodyParser())
  .use(eventNormalizer())
  .use(
    validator({
      eventSchema: transpileSchema(schema)
    })
  );
