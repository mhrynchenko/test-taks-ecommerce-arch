import { PaymentStatuses } from '@common-types/index';

export abstract class StripeAdapter {
  order_id: string;
  status: PaymentStatuses;
}