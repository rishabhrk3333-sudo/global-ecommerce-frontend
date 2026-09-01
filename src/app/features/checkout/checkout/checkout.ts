import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../../shared/services/cart.service/cart-service';
import { Payment } from '../../../shared/services/payment.service/payment';

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  readonly cartService = inject(CartService);
  private readonly paymentService = inject(Payment);

  selectedPaymentMethod: 'STRIPE' | 'PAYPAL' = 'STRIPE';

  paymentStatus: 'IDLE' | 'PROCESSING' | 'SUCCESS' | 'FAILED' = 'IDLE';

  checkoutForm = this.fb.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
    address: ['', [Validators.required, Validators.minLength(5)]],
    city: ['', Validators.required],
    state: ['', Validators.required],
    postalCode: ['', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]],
    country: ['India', Validators.required],
  });

  get orderTotal(): number {
    return this.cartService.items().reduce((total, item) => {
      const price = (item as { price?: number }).price ?? 0;
      const quantity = (item as { quantity?: number }).quantity ?? 1;

      return total + price * quantity;
    }, 0);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.checkoutForm.get(fieldName);

    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  continueToPayment(): void {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }
    if (this.cartService.items().length === 0) {
      alert('Your cart is empty. Please add a product before continuing.');
      this.router.navigate(['/cart']);
      return;
    }
    // console.log('Checkout details:', this.checkoutForm.getRawValue());
    alert(
      'Your order request has been received successfully. We’ll contact you shortly with the next steps.',
    );
    this.router.navigate(['/checkout/payment']);
  }

  placeOrder(): void {
    this.paymentStatus = 'PROCESSING';

    this.paymentService.processPayment(this.orderTotal, this.selectedPaymentMethod).subscribe({
      next: (result) => {
        if (result.success) {
          this.paymentStatus = 'SUCCESS';
        } else {
          this.paymentStatus = 'FAILED';
        }
      },

      error: () => {
        this.paymentStatus = 'FAILED';
      },
    });
  }
}
