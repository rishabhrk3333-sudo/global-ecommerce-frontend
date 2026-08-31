import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';

import { AdminOrderDetails } from './admin-order-details';
import { OrderService } from '../../../../shared/services/order.service/order';
import { Order } from '../../../../core/models/order.model';

describe.only('AdminOrderDetails', () => {
  let component: AdminOrderDetails;
  let orderService: OrderService;

  const mockOrder: Order = {
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
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AdminOrderDetails],
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

    const fixture = TestBed.createComponent(AdminOrderDetails);
    component = fixture.componentInstance;

    orderService = TestBed.inject(OrderService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load order using route id', () => {
    vi.spyOn(orderService, 'getOrderById').mockReturnValue(of(mockOrder));

    component.ngOnInit();

    expect(orderService.getOrderById).toHaveBeenCalledWith('ORD-001');
    expect(component.order()).toEqual(mockOrder);
  });

  it('should not load order when route id is missing', () => {
    const spy = vi.spyOn(orderService, 'getOrderById');

    TestBed.resetTestingModule();

    TestBed.configureTestingModule({
      imports: [AdminOrderDetails],
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

    const fixture = TestBed.createComponent(AdminOrderDetails);
    const newComponent = fixture.componentInstance;

    newComponent.ngOnInit();

    expect(spy).not.toHaveBeenCalled();
    expect(newComponent.order()).toBeNull();
  });

  it('should keep order null when loading fails', () => {
    vi.spyOn(orderService, 'getOrderById').mockReturnValue(
      throwError(() => new Error('Failed to load order')),
    );

    component.ngOnInit();

    expect(component.order()).toBeNull();
  });
});
