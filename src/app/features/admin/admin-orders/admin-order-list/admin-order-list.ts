import { Component, inject, signal } from '@angular/core';
import { OrderService } from '../../../../shared/services/order.service/order';
import { Order } from '../../../../core/models/order.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-order-list',
  imports: [RouterLink],
  templateUrl: './admin-order-list.html',
  styleUrl: './admin-order-list.css',
})
export class AdminOrderList {
  private readonly orderService = inject(OrderService);

  readonly orders = signal<Order[]>([]);
  readonly loading = signal(true);

  ngOnInit(): void {
    this.loadOrders();
  }

  private loadOrders(): void {
    this.orderService.getOrders().subscribe({
      next: (orders) => {
        this.orders.set(orders);
        this.loading.set(false);
      },

      error: (error) => {
        console.error('Failed to load orders:', error);
        this.loading.set(false);
      },
    });
  }
}
