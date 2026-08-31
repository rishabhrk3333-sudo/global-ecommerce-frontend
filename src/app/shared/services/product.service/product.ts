import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, of, tap } from 'rxjs';
import { ProductFormValues, Product as ProductModel } from '../../../core/models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly productsUrl = 'assets/data/products.json';

  private readonly products$ = new BehaviorSubject<ProductModel[]>([]);
  private isLoaded = false;

  getProducts(): Observable<ProductModel[]> {
    if (!this.isLoaded) {
      return this.http.get<ProductModel[]>(this.productsUrl).pipe(
        tap((products) => {
          this.products$.next(products);
          this.isLoaded = true;
        }),
      );
    }
    return this.products$.asObservable();
  }

  getProductById(id: number): Observable<ProductModel | undefined> {
    return this.getProducts().pipe(map((products) => products.find((item) => item?.id === id)));
  }

  addProduct(newProductValues: ProductFormValues): Observable<ProductModel> {
    const currentProducts = this.products$.getValue();

    const maxId = currentProducts.reduce((max, p) => (p.id > max ? p.id : max), 0);
    const newProduct: ProductModel = {
      ...newProductValues,
      id: maxId + 1,
      rating: 0,
    };

    this.products$.next([...currentProducts, newProduct]);
    return of(newProduct);
  }

  updateProduct(id: number, updatedValues: ProductFormValues): Observable<ProductModel> {
    const currentProducts = this.products$.getValue();
    const index = currentProducts.findIndex((p) => p.id === id);

    if (index !== -1) {
      const updatedProduct: ProductModel = {
        ...currentProducts[index],
        ...updatedValues,
      };

      const updatedList = [...currentProducts];
      updatedList[index] = updatedProduct;

      this.products$.next(updatedList);
      return of(updatedProduct);
    }

    throw new Error(`Product with ID ${id} not found.`);
  }

  deleteProduct(id: number): void {
    const currentProducts = this.products$.getValue();
    const updatedList = currentProducts.filter((p) => p.id !== id);
    this.products$.next(updatedList);
  }
}
