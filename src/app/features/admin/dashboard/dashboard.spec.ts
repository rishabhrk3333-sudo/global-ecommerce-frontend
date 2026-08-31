import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { Dashboard } from './dashboard';
import { ProductService } from '../../../shared/services/product.service/product';
import { OrderService } from '../../../shared/services/order.service/order';
import { Product } from '../../../core/models/product.model';
import { Order } from '../../../core/models/order.model';

describe.only('Dashboard', () => {
  let component: Dashboard;

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
  ];

  const mockOrders: Order[] = [
    {
      id: 'ORD-001',
      userId: 1,
      date: '2026-08-31',
      items: [],
      subtotal: 50000,
      shipping: 500,
      total: 50500,
      paymentMethod: 'STRIPE',
      paymentStatus: 'SUCCESS',
      status: 'DELIVERED',
    },
    {
      id: 'ORD-002',
      userId: 2,
      date: '2026-08-30',
      items: [],
      subtotal: 30000,
      shipping: 500,
      total: 30500,
      paymentMethod: 'PAYPAL',
      paymentStatus: 'PENDING',
      status: 'PENDING',
    },
  ];

  const productServiceMock = {
    getProducts: vi.fn(),
  };

  const orderServiceMock = {
    getOrders: vi.fn(),
  };

  beforeEach(() => {
    productServiceMock.getProducts.mockReturnValue(of([]));
    orderServiceMock.getOrders.mockReturnValue(of([]));

    TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [
        provideRouter([]),
        {
          provide: ProductService,
          useValue: productServiceMock,
        },
        {
          provide: OrderService,
          useValue: orderServiceMock,
        },
      ],
    });

    const fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load dashboard data correctly', () => {
    productServiceMock.getProducts.mockReturnValue(of(mockProducts));
    orderServiceMock.getOrders.mockReturnValue(of(mockOrders));

    component.ngOnInit();

    expect(component.products()).toEqual(mockProducts);
    expect(component.orders()).toEqual(mockOrders);

    expect(component.totalProducts()).toBe(1);
    expect(component.totalOrders()).toBe(2);
    expect(component.totalRevenue()).toBe(81000);
    expect(component.pendingOrders()).toBe(1);
    expect(component.loading()).toBe(false);
  });
});
