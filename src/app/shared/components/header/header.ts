import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../services/cart.service/cart-service';
import { AuthService } from '../../services/auth.service/auth';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  readonly cartService = inject(CartService);
  authService = inject(AuthService);
  router = inject(Router);

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

  logout(): void { 
    this.authService.logout(); 
    this.router.navigate(['/login']); }
}
