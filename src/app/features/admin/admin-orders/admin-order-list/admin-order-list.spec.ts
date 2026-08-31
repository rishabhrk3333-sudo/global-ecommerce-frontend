import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { AdminOrderList } from './admin-order-list';
import { OrderService } from '../../../../shared/services/order.service/order';
import { Order } from '../../../../core/models/order.model';

describe.only('AdminOrderList', () => {
  let component: AdminOrderList;
  let orderService: OrderService;

  const mockOrders: Order[] = [
    {
      id: 'ORD-001',
      userId: 1,
      date: '2026-08-31',
      items: [
        {
          productId: 1,
          productName: 'Laptop',
          quantity: 1,
          price: 50000,
        },
      ],
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
      items: [
        {
          productId: 2,
          productName: 'Mobile',
          quantity: 2,
          price: 30000,
        },
      ],
      subtotal: 60000,
      shipping: 500,
      total: 60500,
      paymentMethod: 'PAYPAL',
      paymentStatus: 'PENDING',
      status: 'PROCESSING',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AdminOrderList],
      providers: [
        {
          provide: OrderService,
          useValue: {
            getOrders: vi.fn(),
          },
        },
      ],
    });

    const fixture = TestBed.createComponent(AdminOrderList);
    component = fixture.componentInstance;

    orderService = TestBed.inject(OrderService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load orders successfully', () => {
    vi.spyOn(orderService, 'getOrders').mockReturnValue(of(mockOrders));

    component.ngOnInit();

    expect(component.orders()).toEqual(mockOrders);
    expect(component.orders().length).toBe(2);
    expect(component.loading()).toBe(false);
  });

  it('should set loading to false when loading orders fails', () => {
    vi.spyOn(orderService, 'getOrders').mockReturnValue(
      throwError(() => new Error('Failed to load orders')),
    );

    component.ngOnInit();

    expect(component.loading()).toBe(false);
    expect(component.orders()).toEqual([]);
  });
});
