import { Injectable, signal, computed } from '@angular/core';
import { CartItem } from '../../models/cart.model';
import { Product } from '../../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly storageKey = 'ecommerce-cart';

  private readonly cartItems = signal<CartItem[]>(
    this.loadCart()
  );

  readonly items = this.cartItems.asReadonly();

  readonly itemCount = computed(() =>
    this.cartItems().reduce(
      (total, item) => total + item.quantity,
      0
    )
  );

  readonly subtotal = computed(() =>
    this.cartItems().reduce(
      (total, item) =>
        total + item.product.price * item.quantity,
      0
    )
  );

  addToCart(product: Product, quantity = 1): void {
    this.cartItems.update(items => {
      const existingItem = items.find(
        item => item.product.id === product.id
      );

      if (existingItem) {
        return items.map(item =>
          item.product.id === product.id
            ? {
                ...item,
                quantity: item.quantity + quantity
              }
            : item
        );
      }
      return [
        ...items,
        {
          product,
          quantity
        }
      ];
    });
    this.saveCart();
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }
    this.cartItems.update(items =>
      items.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    );

    this.saveCart();
  }

  removeFromCart(productId: number): void {

    this.cartItems.update(items =>
      items.filter(
        item => item.product.id !== productId
      )
    );

    this.saveCart();
  }

  clearCart(): void {

    this.cartItems.set([]);

    localStorage.removeItem(this.storageKey);
  }

  private saveCart(): void {

    localStorage.setItem(
      this.storageKey,
      JSON.stringify(this.cartItems())
    );
  }

  private loadCart(): CartItem[] {

    const storedCart = localStorage.getItem(
      this.storageKey
    );

    if (!storedCart) {
      return [];
    }

    try {
      return JSON.parse(storedCart) as CartItem[];
    } catch {
      return [];
    }
  }
}
