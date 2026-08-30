import { Component, inject } from '@angular/core';
import { ProductForm } from '../product-form/product-form';
import { Router } from '@angular/router';
import { ProductFormValues } from '../../../../shared/models/product.model';
import { ProductService } from '../../../../shared/services/product.service/product';

@Component({
  selector: 'app-add-product',
  imports: [ProductForm],
  templateUrl: './add-product.html',
  styleUrl: './add-product.css',
})
export class AddProduct {
  private readonly router = inject(Router);
  productService = inject(ProductService);

  onAddProduct(formData: ProductFormValues): void {
    this.productService.addProduct(formData).subscribe({
      next: (createdProduct) => {
        alert('Product successfully added:');
        this.router.navigate(['/admin/products']);
      },
      error: (error) => {
        console.error('Failed to add product:', error);
      },
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin/products']);
  }
}
