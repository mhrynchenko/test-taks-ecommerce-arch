import { PaymentProviders, PaymentStatus } from '@common-types/index';
import { StripeAdapter } from '../../adapters/stripe_adapter';

export class StripePaymentAdapter extends StripeAdapter {
  amount: number;
  currency: string;
  payment_provider: PaymentProviders;
  
  constructor (data: any) {
    super();
    
    this.order_id = data.order_id;
    this.currency = data.currency;
    this.payment_provider = data.payment_provider;
    this.status = PaymentStatus.PENDING;
  }
}