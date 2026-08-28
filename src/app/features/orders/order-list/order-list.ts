import {
  Component,
  computed,
  inject,
  signal
} from '@angular/core';

import { RouterLink } from '@angular/router';

import {
  Order,
  OrderStatus
} from '../../../shared/models/order.model';

import { OrderService } from '../../../shared/services/order.service/order';


@Component({
  selector: 'app-order-list',

  imports: [RouterLink],

  templateUrl: './order-list.html',

  styleUrl: './order-list.css'
})
export class OrderList {

  private readonly orderService =
    inject(OrderService);


  readonly orders =
    signal<Order[]>([]);


  readonly loading =
    signal(true);


  readonly error =
    signal<string | null>(null);


  ngOnInit(): void {

    this.loadOrders();

  }


  private loadOrders(): void {

    this.loading.set(true);

    this.error.set(null);


    this.orderService.getOrders().subscribe({

      next: (orders) => {

        this.orders.set(orders);

        this.loading.set(false);

      },

      error: (error: unknown) => {

        console.error(
          'Failed to load orders',
          error
        );

        this.error.set(
          'Unable to load orders.'
        );

        this.loading.set(false);

      }

    });

  }

}
