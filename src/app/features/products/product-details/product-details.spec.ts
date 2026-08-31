import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

import { ProductDetails } from './product-details';
import { ProductService } from '../../../shared/services/product.service/product';
import { CartService } from '../../../shared/services/cart.service/cart-service';
import { Product } from '../../../core/models/product.model';

describe.only('ProductDetails', () => {
  let component: ProductDetails;
  let productService: ProductService;
  let cartService: CartService;
  let router: Router;

  const mockProduct: Product = {
    id: 1,
    name: 'Laptop',
    description: 'Powerful laptop',
    price: 50000,
    image: 'laptop.jpg',
    stock: 10,
    category: 'Electronics',
    rating: 4.5,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProductDetails],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '1',
              },
            },
          },
        },
        {
          provide: ProductService,
          useValue: {
            getProductById: vi.fn(),
          },
        },
        {
          provide: CartService,
          useValue: {
            addToCart: vi.fn(),
          },
        },
        {
          provide: Router,
          useValue: {
            navigate: vi.fn(),
            navigateByUrl: vi.fn(),
          },
        },
      ],
    });

    const fixture = TestBed.createComponent(ProductDetails);
    component = fixture.componentInstance;

    productService = TestBed.inject(ProductService);
    cartService = TestBed.inject(CartService);
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load product successfully', () => {
    vi.spyOn(productService, 'getProductById').mockReturnValue(of(mockProduct));

    component.ngOnInit();

    expect(productService.getProductById).toHaveBeenCalledWith(1);
    expect(component.product()).toEqual(mockProduct);
    expect(component.loading()).toBe(false);
    expect(component.error()).toBe(false);
  });

  it('should increase and decrease quantity', () => {
    expect(component.quantity()).toBe(1);

    component.increaseQuantity();

    expect(component.quantity()).toBe(2);

    component.decreaseQuantity();

    expect(component.quantity()).toBe(1);

    component.decreaseQuantity();

    expect(component.quantity()).toBe(1);
  });

  it('should add product to cart and navigate to cart', () => {
    vi.spyOn(cartService, 'addToCart');
    vi.spyOn(router, 'navigateByUrl');

    component.product.set(mockProduct);
    component.quantity.set(2);

    vi.spyOn(window, 'alert').mockImplementation(() => {});

    component.addToCart();

    expect(cartService.addToCart).toHaveBeenCalledWith(mockProduct, 2);

    expect(router.navigateByUrl).toHaveBeenCalledWith('/cart');
  });

  it('should navigate back to products', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');

    component.goBack();

    expect(navigateSpy).toHaveBeenCalledWith(['/products']);
  });
});
