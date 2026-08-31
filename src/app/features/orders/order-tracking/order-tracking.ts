import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { Order as OrderModel } from '../../../core/models/order.model';
import { OrderService } from '../../../shared/services/order.service/order';

@Component({
  selector: 'app-order-tracking',
  imports: [RouterLink],
  templateUrl: './order-tracking.html',
  styleUrl: './order-tracking.css',
})
export class OrderTracking {
  private readonly route = inject(ActivatedRoute);
  private readonly orderService = inject(OrderService);

  readonly order = signal<OrderModel | null>(null);

  readonly loading = signal(true);

  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('id');

    if (!orderId) {
      this.error.set('Order ID is missing.');
      this.loading.set(false);
      return;
    }

    this.loadOrder(orderId);
  }

  private loadOrder(orderId: string): void {
    this.orderService.getOrderById(orderId).subscribe({
      next: (order) => {
        if (!order) {
          this.error.set('Order not found.');
        }

        this.order.set(order ?? null);

        this.loading.set(false);
      },

      error: (error: unknown) => {
        console.error('Failed to load order tracking', error);

        this.error.set('Unable to load order tracking.');

        this.loading.set(false);
      },
    });
  }

  isCompleted(status: string): boolean {
    const currentStatus = this.order()?.status;

    const statusOrder = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'];

    const currentIndex = statusOrder.indexOf(currentStatus ?? '');

    const itemIndex = statusOrder.indexOf(status);

    return currentIndex >= itemIndex;
  }

  isCurrent(status: string): boolean {
    return this.order()?.status === status;
  }
}
