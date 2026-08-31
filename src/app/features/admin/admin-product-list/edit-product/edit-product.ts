import { Component, inject, OnInit, signal } from '@angular/core';
import { Product, ProductFormValues } from '../../../../core/models/product.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductForm } from '../product-form/product-form';
import { ProductService } from '../../../../shared/services/product.service/product';

@Component({
  selector: 'app-edit-product',
  imports: [ProductForm],
  templateUrl: './edit-product.html',
  styleUrl: './edit-product.css',
})
export class EditProduct implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly productService = inject(ProductService);
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

  //Method to load Product data and patch it into the form
  private loadProduct(id: number): void {
    this.productService.getProductById(id).subscribe((data) => {
      this.product.set(data ?? null);
    });
  }

  //Method to update the current product details
  onUpdateProduct(formData: ProductFormValues): void {
    const id = this.productId();
    if (!id) return;
    console.log(`Updating product ${id} with:`, formData);
    this.productService.updateProduct(id, formData).subscribe(() => {
      this.router.navigate(['/admin/products']);
    });
    this.router.navigate(['/admin/products']);
  }

  onCancel(): void {
    this.router.navigate(['/admin/products']);
  }
}
