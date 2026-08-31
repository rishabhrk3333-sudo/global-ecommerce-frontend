import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { OrderTracking } from './order-tracking';
import { OrderService } from '../../../shared/services/order.service/order';
import { Order } from '../../../core/models/order.model';

describe.only('OrderTracking', () => {
  let component: OrderTracking;
  let orderService: OrderService;

  const mockOrder: Order = {
    id: 'ORD-001',
    userId: 1,
    date: '2026-08-31',
    items: [],
    subtotal: 50000,
    shipping: 500,
    total: 50500,
    paymentMethod: 'STRIPE',
    paymentStatus: 'SUCCESS',
    status: 'SHIPPED',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OrderTracking],
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

    const fixture = TestBed.createComponent(OrderTracking);
    component = fixture.componentInstance;

    orderService = TestBed.inject(OrderService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load order successfully', () => {
    vi.spyOn(orderService, 'getOrderById').mockReturnValue(of(mockOrder));

    component.ngOnInit();

    expect(component.order()).toEqual(mockOrder);
    expect(component.loading()).toBe(false);
    expect(component.error()).toBeNull();
  });

  it('should show error when order id is missing', () => {
    TestBed.resetTestingModule();

    TestBed.configureTestingModule({
      imports: [OrderTracking],
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

    const fixture = TestBed.createComponent(OrderTracking);
    const newComponent = fixture.componentInstance;

    newComponent.ngOnInit();

    expect(newComponent.error()).toBe('Order ID is missing.');
    expect(newComponent.loading()).toBe(false);
  });

  it('should check order status correctly', () => {
    component.order.set(mockOrder);

    expect(component.isCompleted('PENDING')).toBe(true);
    expect(component.isCompleted('PROCESSING')).toBe(true);
    expect(component.isCompleted('SHIPPED')).toBe(true);
    expect(component.isCompleted('DELIVERED')).toBe(false);

    expect(component.isCurrent('SHIPPED')).toBe(true);
    expect(component.isCurrent('DELIVERED')).toBe(false);
  });
});
