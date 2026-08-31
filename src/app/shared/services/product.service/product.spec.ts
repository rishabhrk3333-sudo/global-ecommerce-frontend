import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { ProductService } from './product';
import { Product, ProductFormValues } from '../../../core/models/product.model';
import { EditProduct } from '../../../features/admin/admin-product-list/edit-product/edit-product';

describe.only('ProductService', () => {
  let service: ProductService;
  let httpTestingController: HttpTestingController;
  const mockProducts: Product[] = [
    {
      id: 1,
      name: 'Laptop',
      description: 'A powerful laptop for everyday use',
      price: 50000,
      image: 'laptop.jpg',
      stock: 10,
      category: 'Electronics',
      rating: 4.5,
    },
    {
      id: 2,
      name: 'Mobile',
      description: 'A modern smartphone',
      price: 30000,
      image: 'mobile.jpg',
      stock: 15,
      category: 'Electronics',
      rating: 4,
    },
  ];
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(ProductService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load products from JSON', () => {
    service.getProducts().subscribe((products) => {
      expect(products).toEqual(mockProducts);
      expect(products.length).toBe(2);
    });

    const request = httpTestingController.expectOne('assets/data/products.json');

    expect(request.request.method).toBe('GET');

    request.flush(mockProducts);
  });

  it('should not make another HTTP request after products are loaded', () => {
    // First call
    service.getProducts().subscribe();

    const request = httpTestingController.expectOne('assets/data/products.json');

    request.flush(mockProducts);

    // Second call
    service.getProducts().subscribe((products) => {
      expect(products).toEqual(mockProducts);
    });

    // No second HTTP request should be made.
    httpTestingController.expectNone('assets/data/products.json');
  });

  it('should return product by id', () => {
    service.getProducts().subscribe();

    const request = httpTestingController.expectOne('assets/data/products.json');

    request.flush(mockProducts);

    service.getProductById(2).subscribe((product) => {
      expect(product).toEqual(mockProducts[1]);
      expect(product?.name).toBe('Mobile');
    });
  });

  it('should return undefined when product id does not exist', () => {
    service.getProducts().subscribe();

    const request = httpTestingController.expectOne('assets/data/products.json');

    request.flush(mockProducts);

    service.getProductById(999).subscribe((product) => {
      expect(product).toBeUndefined();
    });
  });

  it('should add a new product', () => {
    service.getProducts().subscribe();

    const request = httpTestingController.expectOne('assets/data/products.json');

    request.flush(mockProducts);

    const newProduct: ProductFormValues = {
      name: 'Headphones',
      description: 'Wireless headphones',
      price: 5000,
      image: 'headphones.jpg',
      stock: 10,
      category: 'Accessories',
    };

    service.addProduct(newProduct).subscribe((product) => {
      expect(product.name).toBe('Headphones');
      expect(product.id).toBe(3);
      expect(product.rating).toBe(0);
    });

    service.getProducts().subscribe((products) => {
      expect(products.length).toBe(3);
      expect(products[2].name).toBe('Headphones');
    });
  });

  it('should update an existing product', () => {
    service.getProducts().subscribe();

    const request = httpTestingController.expectOne('assets/data/products.json');

    request.flush(mockProducts);

    const updatedValues: ProductFormValues = {
      name: 'Updated Laptop',
      description: 'Updated laptop description',
      price: 60000,
      image: 'updated-laptop.jpg',
      stock: 20,
      category: 'Electronics',
    };

    service.updateProduct(1, updatedValues).subscribe((product) => {
      expect(product.id).toBe(1);
      expect(product.name).toBe('Updated Laptop');
      expect(product.price).toBe(60000);
      expect(product.rating).toBe(4.5);
    });
  });

  it('should delete a product', () => {
    service.getProducts().subscribe();

    const request = httpTestingController.expectOne('assets/data/products.json');

    request.flush(mockProducts);

    service.deleteProduct(1);

    service.getProducts().subscribe((products) => {
      expect(products.length).toBe(1);
      expect(products[0].id).toBe(2);
      expect(products[0].name).toBe('Mobile');
    });
  });

  it('should throw an error when updating a non-existing product', () => {
    service.getProducts().subscribe();

    const request = httpTestingController.expectOne('assets/data/products.json');

    request.flush(mockProducts);

    let error: Error | undefined;

    try {
      service.updateProduct(999, {
        name: 'Test',
        description: 'Test product',
        price: 100,
        image: 'test.jpg',
        stock: 5,
        category: 'Test',
      });
    } catch (err) {
      error = err as Error;
    }

    expect(error?.message).toBe('Product with ID 999 not found.');
  });
});
