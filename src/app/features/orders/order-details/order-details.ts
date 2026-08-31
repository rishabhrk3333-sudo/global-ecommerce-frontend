import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrderService } from '../../../shared/services/order.service/order';
import { Order } from '../../../core/models/order.model';

@Component({
  selector: 'app-order-details',
  imports: [RouterLink],
  templateUrl: './order-details.html',
  styleUrl: './order-details.css',
})
export class OrderDetails implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly orderService = inject(OrderService);

  order = signal<Order | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('id');

    if (!orderId) {
      this.error.set('Order ID is missing.');
      this.loading.set(false);
      return;
    }
    this.loadOrder(orderId);
  }

  //Method to load oder on order ID by using order service.
  loadOrder(orderId: string): void {
    this.loading.set(true);
    this.error.set(null);
    this.orderService.getOrderById(orderId).subscribe({
      next: (order) => {
        this.order.set(order ?? null);
        if (!order) {
          this.error.set('Order not found.');
        }
        this.loading.set(false);
      },
      error: (error: unknown) => {
        console.error('Failed to load order details', error);
        this.error.set('Unable to load order details. Please try again.');
        this.loading.set(false);
      },
    });
  }

  getItemTotal(price: number, quantity: number): number {
    return price * quantity;
  }
}
