import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { Order } from '../../models/order.model';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private readonly http = inject(HttpClient);
    private readonly ordersUrl = 'assets/data/orders.json';


    getOrders(): Observable<Order[]> {
        return this.http.get<Order[]>(
            this.ordersUrl
        );
    }

    getOrderById( id: string ): Observable<Order | undefined> {
        return this.getOrders()
            .pipe(
                map(orders => orders.find(order => order.id === id)
            )
        );
    }
}
