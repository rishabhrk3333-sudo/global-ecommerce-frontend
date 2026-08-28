import {
  Component,
  inject,
  signal
} from '@angular/core';

import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { Product } from '../../../shared/models/product.model';
import { ProductService } from '../../../shared/services /product.service/product';
import { CartService } from '../../../shared/services /cart.service/cart-service';

@Component({
  selector: 'app-product-details',
  imports: [],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css'
})
export class ProductDetails {
  private readonly productService = inject(ProductService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly cartService = inject(CartService);

  product = signal<Product | undefined>(undefined);

  quantity = signal(1);

  loading = signal(true);

  error = signal(false);

  ngOnInit(): void {
    this.loadProduct();
  }

  private loadProduct(): void {

    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.loading.set(false);
      this.error.set(true);
      return;
    }

    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.product.set(product);
        this.loading.set(false);

        if (!product) {
          this.error.set(true);
        }
      },

      error: (error: unknown) => {
        console.error('Failed to load product:', error);

        this.loading.set(false);
        this.error.set(true);
      }
    });
  }

  increaseQuantity(): void {
    this.quantity.update(value => value + 1);
  }

  decreaseQuantity(): void {

    this.quantity.update(value =>
      Math.max(1, value - 1)
    );
  }

  //method to add product into cart by using cart service
  addToCart(): void {
    const selectedProduct = this.product();
    if (!selectedProduct) {
      return;
    }
    this.cartService.addToCart(
      selectedProduct,
      this.quantity()
    );
    console.log('Product added to cart');
  }


  goBack(): void {
    this.router.navigate(['/products']);
  }

}
