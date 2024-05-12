export const schema = {
  type: 'object',
  required: ['metadata', 'amount', 'currency', 'payment_provider'],
  properties: {
    metadata: {
      type: 'object',
      properties: {
        order_id: {
          type: 'string',
        },
      },
    },
    amount: {
      type: 'string',
    },
    currency: {
      type: 'string',
    },
    payment_provider: {
      type: 'string',
    },
  },
};
