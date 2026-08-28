import {
  Component,
  inject
} from '@angular/core';
import { CartService } from '../../../shared/services /cart.service/cart-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart {

  readonly cartService = inject(CartService);
   private router = inject(Router);

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

  navigateToCheckout(){
    this.router.navigate(['/checkout']);
  }
}
