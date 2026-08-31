import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../../core/models/product.model';
import { ProductService } from '../../../shared/services/product.service/product';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { Loader } from '../../../shared/components/loader/loader';

@Component({
  selector: 'app-product-list',
  imports: [RouterLink, EmptyState, Loader],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList {
  private readonly productService = inject(ProductService);

  products = signal<Product[]>([]);
  searchTerm = signal('');
  selectedCategory = signal('All');
  selectedSort = signal('default');
  isLoading = signal(true);
  isError = signal(false);

  // Generate categories from products
  categories = computed(() => {
    const categories = this.products().map((product) => product.category);
    return ['All', ...new Set(categories)];
  });

  // Filter and sort products
  filteredProducts = computed(() => {
    let result = [...this.products()];
    // Search
    const search = this.searchTerm().trim().toLowerCase();
    if (search) {
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(search) ||
          product.description.toLowerCase().includes(search),
      );
    }

    // Category filter
    const category = this.selectedCategory();

    if (category !== 'All') {
      result = result.filter((product) => product.category === category);
    }

    // Sorting
    switch (this.selectedSort()) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;

      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;

      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
    }

    return result;
  });

  ngOnInit(): void {
    this.loadProducts();
  }

  /**
   * Load products from ProductService
   */
  private loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products.set(products);
        this.isLoading.set(false);
        this.isError.set(false);
      },
      error: (error: unknown) => {
        console.error('Failed to load products:', error);
        this.isLoading.set(false);
        this.isError.set(true);
      },
    });
  }

  /**
   * Handle product search
   */
  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  /**
   * Handle category filter
   */
  onCategoryChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedCategory.set(select.value);
  }

  /**
   * Handle sorting
   */
  onSortChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedSort.set(select.value);
  }
}
