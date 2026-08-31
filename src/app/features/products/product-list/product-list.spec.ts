import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { ProductList } from './product-list';
import { ProductService } from '../../../shared/services/product.service/product';
import { Product } from '../../../core/models/product.model';

describe.only('ProductList', () => {
  let component: ProductList;
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
    {
      id: 3,
      name: 'Shoes',
      description: 'Running shoes',
      price: 2000,
      image: 'shoes.jpg',
      stock: 15,
      category: 'Fashion',
      rating: 4.8,
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProductList],
      providers: [
        {
          provide: ProductService,
          useValue: {
            getProducts: vi.fn(),
          },
        },
      ],
    });

    const fixture = TestBed.createComponent(ProductList);
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
    expect(component.isLoading()).toBe(false);
    expect(component.isError()).toBe(false);
  });

  it('should filter products by search term', () => {
    component.products.set(mockProducts);
    component.searchTerm.set('laptop');

    expect(component.filteredProducts().length).toBe(1);
    expect(component.filteredProducts()[0].name).toBe('Laptop');
  });

  it('should sort products by price from low to high', () => {
    component.products.set(mockProducts);
    component.selectedSort.set('price-low');

    const products = component.filteredProducts();

    expect(products[0].name).toBe('Shoes');
    expect(products[1].name).toBe('Mobile');
    expect(products[2].name).toBe('Laptop');
  });

  it('should handle product loading error', () => {
    vi.spyOn(productService, 'getProducts').mockReturnValue(
      throwError(() => new Error('Failed to load products')),
    );

    component.ngOnInit();

    expect(component.isLoading()).toBe(false);
    expect(component.isError()).toBe(true);
  });
});
