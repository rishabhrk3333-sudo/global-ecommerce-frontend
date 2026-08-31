import { TestBed } from '@angular/core/testing';
import { Product } from '../../../core/models/product.model';
import { CartService } from './cart-service';

describe.only('CartService', () => {
  let service: CartService;

  const mockProduct: Product = {
    id: 1,
    name: 'Laptop',
    description: 'A powerful laptop',
    price: 50000,
    image: 'laptop.jpg',
    stock: 10,
    category: 'Electronics',
    rating: 4.5,
  };

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [CartService],
    });

    service = TestBed.inject(CartService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a product to cart', () => {
    service.addToCart(mockProduct, 2);

    expect(service.items().length).toBe(1);
    expect(service.items()[0].product.id).toBe(1);
    expect(service.items()[0].quantity).toBe(2);
  });

  it('should increase quantity when adding an existing product', () => {
    service.addToCart(mockProduct, 2);
    service.addToCart(mockProduct, 3);

    expect(service.items().length).toBe(1);
    expect(service.items()[0].quantity).toBe(5);
  });

  it('should remove product from cart', () => {
    service.addToCart(mockProduct, 2);

    service.removeFromCart(mockProduct.id);

    expect(service.items().length).toBe(0);
    expect(service.itemCount()).toBe(0);
  });

  it('should calculate item count and subtotal', () => {
    service.addToCart(mockProduct, 2);

    expect(service.itemCount()).toBe(2);
    expect(service.subtotal()).toBe(100000);
  });

  it('should clear the cart', () => {
    service.addToCart(mockProduct, 2);

    service.clearCart();

    expect(service.items()).toEqual([]);
    expect(service.itemCount()).toBe(0);
    expect(service.subtotal()).toBe(0);
    expect(localStorage.getItem('ecommerce-cart')).toBeNull();
  });
});
