import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';
import { adminGuard } from './shared/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
  },
  {
    path: 'products',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/products/product-list/product-list').then((m) => m.ProductList),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./features/products/product-details/product-details').then(
            (m) => m.ProductDetails,
          ),
      },
    ],
  },
  {
    path: 'cart',
    loadComponent: () => import('./features/cart/cart/cart').then((m) => m.Cart),
  },
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: 'checkout',
        loadComponent: () =>
          import('./features/checkout/checkout/checkout').then((m) => m.Checkout),
      },
      {
        path: 'orders',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./features/orders/order-list/order-list').then((m) => m.OrderList),
          },
          {
            path: ':id',
            loadComponent: () =>
              import('./features/orders/order-details/order-details').then((m) => m.OrderDetails),
          },
          {
            path: ':id/tracking',
            loadComponent: () =>
              import('./features/orders/order-tracking/order-tracking').then(
                (m) => m.OrderTracking,
              ),
          },
        ],
      },
    ],
  },

  // Admin Routes
  {
    path: 'admin',
    canActivate: [adminGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/admin/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'products',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./features/admin/admin-product-list/admin-product-list').then(
                (m) => m.AdminProductList,
              ),
          },
          {
            path: 'add',
            loadComponent: () =>
              import('./features/admin/admin-product-list/add-product/add-product').then(
                (m) => m.AddProduct,
              ),
          },
          {
            path: 'edit/:id',
            loadComponent: () =>
              import('./features/admin/admin-product-list/edit-product/edit-product').then(
                (m) => m.EditProduct,
              ),
          },
        ],
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./features/admin/admin-orders/admin-order-list/admin-order-list').then(
            (m) => m.AdminOrderList,
          ),
      },
      {
        path: 'orders/:id',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./features/admin/admin-orders/admin-order-details/admin-order-details').then(
            (m) => m.AdminOrderDetails,
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'products',
  },
];
