import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrderService } from '../../../../shared/services/order.service/order';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-admin-order-details',
  imports: [DecimalPipe, RouterLink],
  templateUrl: './admin-order-details.html',
  styleUrl: './admin-order-details.css',
})
export class AdminOrderDetails {
  private readonly route = inject(ActivatedRoute);
  private readonly orderService = inject(OrderService);

  readonly order = signal<any | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      return;
    }

    this.orderService.getOrderById(id).subscribe({
      next: (order) => {
        this.order.set(order);
      },
      error: (error) => {
        console.error('Error loading order:', error);
      },
    });
  }
}
