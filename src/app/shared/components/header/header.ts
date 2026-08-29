import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../services/cart.service/cart-service';
import { AuthService } from '../../services/auth.service/auth';
import { ThemeService } from '../../services/theme.service/theme';

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
  themeService = inject(ThemeService);

  readonly currentUser = this.authService.currentUser;
  readonly isLoggedIn = this.authService.isLoggedIn;

  isMenuOpen = signal(false);
  isNavOpen = signal(false);

  navItems = [
    {
      label: 'Products',
      route: '/products',
      isAdmin: false,
    },
    {
      label: 'Orders',
      route: '/orders',
      isAdmin: false,
    },
    {
      label: 'Cart',
      route: '/cart',
      isAdmin: false,
    },
    {
      label: 'Admin',
      route: '/admin/dashboard',
      isAdmin: true,
    },
  ];

  toggleNav(): void {
    this.isNavOpen.update((prev) => !prev);
  }

  closeNav(): void {
    this.isNavOpen.set(false);
  }

  toggleMenu(): void {
    this.isMenuOpen.update((prev) => !prev);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  onLogout(): void {
    this.closeMenu();
    this.logout();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
