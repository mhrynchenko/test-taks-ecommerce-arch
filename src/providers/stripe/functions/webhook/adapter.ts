import { PaymentStatus } from '@common-types/index';
import { StripeAdapter } from '../../adapters/stripe_adapter';

export class StripeWebhookAdapter extends StripeAdapter {
  constructor (data: any) {
    super();
    
    this.order_id = data.order_id;

    if (data.status === 1) {
      this.status = PaymentStatus.PAYED;
    }

    this.status = PaymentStatus.DECLINED;
  }
}