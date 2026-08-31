import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { AdminProductList } from './admin-product-list';
import { ProductService } from '../../../shared/services/product.service/product';
import { Product } from '../../../core/models/product.model';

describe.only('AdminProductList', () => {
  let component: AdminProductList;
  let productService: ProductService;

  const mockProducts: Product[] = [
    {
      id: 1,
      name: 'Laptop',
      description: 'Powerful laptop',
      price: 50000,
      image: 'laptop.jpg',
      stock: 10,
      category: 'Electronics',
      rating: 4.5,
    },
    {
      id: 2,
      name: 'Mobile',
      description: 'Smartphone',
      price: 30000,
      image: 'mobile.jpg',
      stock: 20,
      category: 'Electronics',
      rating: 4,
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminProductList],
      providers: [
        provideRouter([]),
        {
          provide: ProductService,
          useValue: {
            getProducts: vi.fn(),
            deleteProduct: vi.fn(),
          },
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(AdminProductList);
    component = fixture.componentInstance;

    productService = TestBed.inject(ProductService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products successfully', () => {
    vi.spyOn(productService, 'getProducts').mockReturnValue(of(mockProducts));

    component.ngOnInit();

    expect(component.products()).toEqual(mockProducts);
    expect(component.loading()).toBe(false);
  });

  it('should delete product', () => {
    const spy = vi.spyOn(productService, 'deleteProduct');

    component.onDelete(1);

    expect(spy).toHaveBeenCalledWith(1);
  });
});
