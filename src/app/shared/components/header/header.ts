import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../services /cart.service/cart-service';

@Component({
  selector: 'app-header',
  imports: [RouterLink,
    RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  readonly cartService = inject(CartService);

   navItems = [
    {
      label: 'Products',
      route: '/products',
      isAdmin: false
    },
    {
      label: 'Orders',
      route: '/orders',
      isAdmin: false
    },
    {
      label: 'Cart',
      route: '/cart',
      isAdmin: false
    },
    {
      label: 'Admin',
      route: '/admin/dashboard',
      isAdmin: true
    }
  ];
  
}
