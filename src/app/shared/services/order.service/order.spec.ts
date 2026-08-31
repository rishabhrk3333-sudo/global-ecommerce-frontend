import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Order } from '../../../core/models/order.model';
import { OrderService } from './order';

describe.only('OrderService', () => {
  let service: OrderService;
  let httpTestingController: HttpTestingController;

  const mockOrders: Order[] = [
    {
      id: 'ORD-001',
      userId: 101,
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
      userId: 102,
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
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(OrderService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all orders', () => {
    service.getOrders().subscribe((orders) => {
      expect(orders).toEqual(mockOrders);
      expect(orders.length).toBe(2);
    });

    const request = httpTestingController.expectOne('assets/data/orders.json');

    expect(request.request.method).toBe('GET');

    request.flush(mockOrders);
  });

  it('should get order by id', () => {
    service.getOrderById('ORD-002').subscribe((order) => {
      expect(order).toEqual(mockOrders[1]);
      expect(order?.id).toBe('ORD-002');
      expect(order?.userId).toBe(102);
      expect(order?.status).toBe('PROCESSING');
    });

    const request = httpTestingController.expectOne('assets/data/orders.json');

    expect(request.request.method).toBe('GET');

    request.flush(mockOrders);
  });

  it('should return undefined when order id does not exist', () => {
    service.getOrderById('ORD-999').subscribe((order) => {
      expect(order).toBeUndefined();
    });

    const request = httpTestingController.expectOne('assets/data/orders.json');

    expect(request.request.method).toBe('GET');

    request.flush(mockOrders);
  });
});
