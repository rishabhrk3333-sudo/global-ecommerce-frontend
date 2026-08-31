import { Component, inject, signal } from '@angular/core';
import { ProductService } from '../../../shared/services/product.service/product';
import { Product } from '../../../core/models/product.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-product-list',
  imports: [RouterLink],
  templateUrl: './admin-product-list.html',
  styleUrl: './admin-product-list.css',
})
export class AdminProductList {
  private readonly productService = inject(ProductService);

  readonly products = signal<Product[]>([]);
  readonly loading = signal(true);

  ngOnInit(): void {
    this.loadProducts();
  }

  private loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products.set(products);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        console.error('Failed to load admin products', error);
        this.loading.set(false);
      },
    });
  }

  onDelete(id: number): void {
    this.productService.deleteProduct(id);
  }
}
