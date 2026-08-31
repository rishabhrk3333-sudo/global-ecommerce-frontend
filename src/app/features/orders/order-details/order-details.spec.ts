import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { OrderDetails } from './order-details';
import { OrderService } from '../../../shared/services/order.service/order';
import { Order } from '../../../core/models/order.model';

describe.only('OrderDetails', () => {
  let component: OrderDetails;
  let orderService: OrderService;

  const mockOrder: Order = {
    id: 'ORD-001',
    userId: 1,
    date: '2026-08-31',
    items: [
      {
        productId: 1,
        productName: 'Laptop',
        quantity: 2,
        price: 50000,
      },
    ],
    subtotal: 100000,
    shipping: 500,
    total: 100500,
    paymentMethod: 'STRIPE',
    paymentStatus: 'SUCCESS',
    status: 'DELIVERED',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OrderDetails],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => 'ORD-001',
              },
            },
          },
        },
        {
          provide: OrderService,
          useValue: {
            getOrderById: vi.fn(),
          },
        },
      ],
    });

    const fixture = TestBed.createComponent(OrderDetails);
    component = fixture.componentInstance;

    orderService = TestBed.inject(OrderService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load order successfully', () => {
    vi.spyOn(orderService, 'getOrderById').mockReturnValue(of(mockOrder));

    component.ngOnInit();

    expect(orderService.getOrderById).toHaveBeenCalledWith('ORD-001');
    expect(component.order()).toEqual(mockOrder);
    expect(component.loading()).toBe(false);
    expect(component.error()).toBeNull();
  });

  it('should show error when order id is missing', () => {
    TestBed.resetTestingModule();

    TestBed.configureTestingModule({
      imports: [OrderDetails],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => null,
              },
            },
          },
        },
        {
          provide: OrderService,
          useValue: {
            getOrderById: vi.fn(),
          },
        },
      ],
    });

    const fixture = TestBed.createComponent(OrderDetails);
    const newComponent = fixture.componentInstance;

    newComponent.ngOnInit();

    expect(newComponent.error()).toBe('Order ID is missing.');
    expect(newComponent.loading()).toBe(false);
  });

  it('should calculate item total correctly', () => {
    expect(component.getItemTotal(50000, 2)).toBe(100000);
  });
});
