import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Product as ProductModel } from '../../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly http = inject(HttpClient);

  private readonly productsUrl = 'assets/data/products.json';

  getProducts(): Observable<ProductModel[]> {
    return this.http.get<ProductModel[]>(this.productsUrl);
  }

  getProductById(id: number): Observable<ProductModel | undefined> {
    return this.getProducts().pipe(
      map(products => products.find(item => item?.id === id))
    );
  }
}
