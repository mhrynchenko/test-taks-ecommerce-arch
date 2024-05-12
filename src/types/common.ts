export enum PaymentStatus {
  PAYED = 'payed',
  PENDING = 'pending',
  DECLINED = 'decliened',
}

export type PaymentStatuses = PaymentStatus.PAYED | PaymentStatus.DECLINED | PaymentStatus.PENDING;

export enum PAYMENT_PROVIDER {
  STRIPE = 'Stripe',
  BRAINTREE = 'Braintree',
  PAYPAL = 'PayPal',
};

export type PaymentProviders = PAYMENT_PROVIDER.STRIPE | PAYMENT_PROVIDER.BRAINTREE | PAYMENT_PROVIDER.PAYPAL;

export interface PaymentParameters {
  metadata: {
    order_id: string;
  };
  amount: number;
  currency: string;
  payment_provider: PaymentProviders;
}

export interface IPaymentProvider<T> {
  pay: (data: T) => Promise<boolean>;
  cancel: (data: any) => Promise<boolean>;
}
