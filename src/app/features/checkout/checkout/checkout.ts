import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../../shared/services /cart.service/cart-service';

@Component({
  selector: 'app-checkout',
  imports: [
    ReactiveFormsModule,
  ],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css'
})
export class Checkout {

  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  readonly cartService = inject(CartService);

  checkoutForm = this.fb.nonNullable.group({

    fullName: [
      '',
      [Validators.required, Validators.minLength(3)]
    ],

    email: [
      '',
      [Validators.required, Validators.email]
    ],

    phone: [
      '',
      [
        Validators.required,
        Validators.pattern(/^[0-9]{10}$/)
      ]
    ],

    address: [
      '',
      [Validators.required, Validators.minLength(5)]
    ],

    city: [
      '',
      Validators.required
    ],

    state: [
      '',
      Validators.required
    ],

    postalCode: [
      '',
      [
        Validators.required,
        Validators.pattern(/^[0-9]{6}$/)
      ]
    ],

    country: [
      'India',
      Validators.required
    ]

  });


  isFieldInvalid(fieldName: string): boolean {

    const field = this.checkoutForm.get(fieldName);

    return !!(
      field &&
      field.invalid &&
      (field.dirty || field.touched)
    );
  }


  continueToPayment(): void {

    if (this.checkoutForm.invalid) {

      this.checkoutForm.markAllAsTouched();

      return;
    }

    if (this.cartService.items().length === 0) {

      this.router.navigate(['/cart']);

      return;
    }

    console.log(
      'Checkout details:',
      this.checkoutForm.getRawValue()
    );

    // Payment step will be implemented next.
    this.router.navigate(['/checkout/payment']);
  }

}
