import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink,
    RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
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
