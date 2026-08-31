import { Component, inject, OnInit, signal } from '@angular/core';
import { Product, ProductFormValues } from '../../../../core/models/product.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductForm } from '../product-form/product-form';

@Component({
  selector: 'app-edit-product',
  imports: [ProductForm],
  templateUrl: './edit-product.html',
  styleUrl: './edit-product.css',
})
export class EditProduct implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  // private readonly productService = inject(ProductService);

  readonly product = signal<Product | null>(null);
  readonly productId = signal<number | null>(null);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      this.productId.set(id);
      this.loadProduct(id);
    }
  }

  private loadProduct(id: number): void {
    // Replace with actual service call:
    // this.productService.getProductById(id).subscribe(data => this.product.set(data));

    // Mock implementation for testing:
    this.product.set({
      id,
      name: 'Sample Product',
      description: 'Existing product description long enough for validation',
      price: 99,
      category: 'Electronics',
      image: 'https://via.placeholder.com/150',
      stock: 12,
      rating: 4.5,
    });
  }

  onUpdateProduct(formData: ProductFormValues): void {
    const id = this.productId();
    if (!id) return;

    console.log(`Updating product ${id} with:`, formData);
    // this.productService.updateProduct(id, formData).subscribe(() => {
    //   this.router.navigate(['/admin/products']);
    // });

    this.router.navigate(['/admin/products']);
  }

  onCancel(): void {
    this.router.navigate(['/admin/products']);
  }
}
