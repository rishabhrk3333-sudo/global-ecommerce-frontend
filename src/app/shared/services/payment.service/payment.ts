import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export type PaymentMethod = 'STRIPE' | 'PAYPAL';

export interface PaymentResult {
  success: boolean;
  transactionId: string;
  paymentMethod: PaymentMethod;
  status: 'SUCCESS' | 'FAILED';
}

@Injectable({
  providedIn: 'root',
})
export class Payment {
  processPayment(amount: number, paymentMethod: PaymentMethod): Observable<PaymentResult> {
    const paymentResult: PaymentResult = {
      success: true,
      transactionId: `TXN-${Date.now()}`,
      paymentMethod,
      status: 'SUCCESS',
    };

    return of(paymentResult).pipe(delay(1500));
  }
}
