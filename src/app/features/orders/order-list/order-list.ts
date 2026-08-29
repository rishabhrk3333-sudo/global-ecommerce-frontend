import { Component, computed, inject, signal, WritableSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Order, OrderStatus } from '../../../shared/models/order.model';
import { OrderService } from '../../../shared/services/order.service/order';

@Component({
  selector: 'app-order-list',
  imports: [RouterLink],
  templateUrl: './order-list.html',
  styleUrl: './order-list.css',
})
export class OrderList {
  private readonly orderService = inject(OrderService);

  readonly orders = signal<Order[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly searchTerm = signal('');
  readonly statusFilter = signal<OrderStatus | 'ALL'>('ALL');
  readonly sortOption = signal<'newest' | 'oldest'>('newest');

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
        console.error('Failed to load orders', error);
        this.error.set('Unable to load orders.');
        this.loading.set(false);
      },
    });
  }

  readonly filteredOrders = computed(() => {
    let result = [...this.orders()];
    const search = this.searchTerm().trim().toLowerCase();
    const status = this.statusFilter();
    // Search
    if (search) {
      result = result.filter((order) => order.id.toLowerCase().includes(search));
    }
    // Status filter
    if (status !== 'ALL') {
      result = result.filter((order) => order.status === status);
    }

    // Sorting
    result.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return this.sortOption() === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return result;
  });

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  onStatusChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.statusFilter.set(select.value as OrderStatus | 'ALL');
  }

  onSortChange(event: Event): void {
    const select = event.target as HTMLSelectElement;

    this.sortOption.set(select.value as 'newest' | 'oldest');
  }

  readonly hasActiveFilters = computed(() => {
    const hasSearch = this.searchTerm().trim().length > 0;
    const hasStatusFilter = this.statusFilter() !== 'ALL';
    const isCustomSorted = this.sortOption() !== 'newest'; // Optional: include sorting check

    return hasSearch || hasStatusFilter || isCustomSorted;
  });

  clearFilters(): void {
    this.searchTerm.set('');
    this.statusFilter.set('ALL');
    this.sortOption.set('newest');
  }
}
