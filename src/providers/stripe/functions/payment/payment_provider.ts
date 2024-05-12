import { IPaymentProvider } from '@common-types/index';

export class StripePaymentProvider<T> implements IPaymentProvider<T> {
  async pay(data: T) {
    return true;
  }
  
  async cancel(data: any) {
    return true;
  }
}
