import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { Cart } from './cart';
import { CartService } from '../../../shared/services/cart.service/cart-service';

describe.only('Cart', () => {
  let component: Cart;
  let cartService: CartService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Cart],
      providers: [CartService, provideRouter([])],
    });

    const fixture = TestBed.createComponent(Cart);
    component = fixture.componentInstance;

    cartService = TestBed.inject(CartService);
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should increase product quantity', () => {
    const spy = vi.spyOn(cartService, 'updateQuantity');

    component.increaseQuantity(1, 2);

    expect(spy).toHaveBeenCalledWith(1, 3);
  });

  it('should decrease product quantity', () => {
    const spy = vi.spyOn(cartService, 'updateQuantity');

    component.decreaseQuantity(1, 2);

    expect(spy).toHaveBeenCalledWith(1, 1);
  });

  it('should remove product from cart', () => {
    const spy = vi.spyOn(cartService, 'removeFromCart');

    component.removeItem(1);

    expect(spy).toHaveBeenCalledWith(1);
  });

  it('should clear the cart', () => {
    const spy = vi.spyOn(cartService, 'clearCart');

    component.clearCart();

    expect(spy).toHaveBeenCalled();
  });

  it('should navigate to checkout', () => {
    const spy = vi.spyOn(router, 'navigate');

    component.navigateToCheckout();

    expect(spy).toHaveBeenCalledWith(['/checkout']);
  });
});
