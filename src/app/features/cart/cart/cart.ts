import {
  Component,
  inject
} from '@angular/core';

import { RouterLink } from '@angular/router';
import { CartService } from '../../../shared/services /cart.service/cart-service';


@Component({
  selector: 'app-cart',
  imports: [],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart {

  readonly cartService = inject(CartService);

  increaseQuantity(
    productId: number,
    currentQuantity: number
  ): void {

    this.cartService.updateQuantity(
      productId,
      currentQuantity + 1
    );
  }

  decreaseQuantity(
    productId: number,
    currentQuantity: number
  ): void {

    this.cartService.updateQuantity(
      productId,
      currentQuantity - 1
    );
  }

  removeItem(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }
}
