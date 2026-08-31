import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product as ProductModel } from '../../../core/models/product.model';
import { Order as OrderModel } from '../../../core/models/order.model';
import { ProductService } from '../../../shared/services/product.service/product';
import { OrderService } from '../../../shared/services/order.service/order';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private readonly productService = inject(ProductService);
  private readonly orderService = inject(OrderService);

  readonly products = signal<ProductModel[]>([]);
  readonly orders = signal<OrderModel[]>([]);

  readonly totalProducts = signal(0);
  readonly totalOrders = signal(0);
  readonly totalRevenue = signal(0);
  readonly pendingOrders = signal(0);

  readonly loading = signal(true);

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products.set(products);

        this.totalProducts.set(products.length);

        this.checkLoadingComplete();
      },

      error: (error: unknown) => {
        console.error('Failed to load products', error);

        this.checkLoadingComplete();
      },
    });

    this.orderService.getOrders().subscribe({
      next: (orders) => {
        this.orders.set(orders);
        this.totalOrders.set(orders.length);
        this.totalRevenue.set(orders.reduce((total, order) => total + order.total, 0));
        this.pendingOrders.set(
          orders.filter((order) => order.status === 'PENDING' || order.status === 'PROCESSING')
            .length,
        );

        this.checkLoadingComplete();
      },

      error: (error: unknown) => {
        console.error('Failed to load orders', error);
        this.checkLoadingComplete();
      },
    });
  }

  private productLoaded = false;
  private orderLoaded = false;

  private checkLoadingComplete(): void {
    if (this.products().length >= 0) {
      this.productLoaded = true;
    }

    if (this.orders().length >= 0) {
      this.orderLoaded = true;
    }

    if (this.productLoaded && this.orderLoaded) {
      this.loading.set(false);
    }
  }

  getRecentOrders(): OrderModel[] {
    return this.orders()
      .slice()
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }
}
