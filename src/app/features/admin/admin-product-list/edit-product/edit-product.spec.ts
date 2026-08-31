import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

import { EditProduct } from './edit-product';
import { ProductService } from '../../../../shared/services/product.service/product';
import { Product, ProductFormValues } from '../../../../core/models/product.model';

describe.only('EditProduct', () => {
  let component: EditProduct;
  let productService: ProductService;
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

  const updatedValues: ProductFormValues = {
    name: 'Updated Laptop',
    description: 'Updated laptop description',
    price: 55000,
    image: 'updated-laptop.jpg',
    stock: 15,
    category: 'Electronics',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EditProduct],
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
            updateProduct: vi.fn(),
          },
        },
        {
          provide: Router,
          useValue: {
            navigate: vi.fn(),
          },
        },
      ],
    });

    const fixture = TestBed.createComponent(EditProduct);
    component = fixture.componentInstance;

    productService = TestBed.inject(ProductService);
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load product using route id', () => {
    vi.spyOn(productService, 'getProductById').mockReturnValue(of(mockProduct));

    component.ngOnInit();

    expect(productService.getProductById).toHaveBeenCalledWith(1);
    expect(component.product()).toEqual(mockProduct);
    expect(component.productId()).toBe(1);
  });

  it('should navigate to admin products when cancel is clicked', () => {
    component.onCancel();

    expect(router.navigate).toHaveBeenCalledWith(['/admin/products']);
  });
});
