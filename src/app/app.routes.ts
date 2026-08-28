import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'Products',
        pathMatch: 'full'
    },
    {
        path: 'login',
        loadComponent: () => import('../app/features/auth/login/login').then(m => m.Login)

    },
    {
        path: 'products',
        loadComponent: () => import('../app/features/products/product-list/product-list').then(m => m.ProductList)
    },
    {
        path: 'products/:id',
        loadComponent: () => import('../app/features/products/product-details/product-details').then(m => m.ProductDetails)
    },
    {
        path: 'cart',
        loadComponent: () => import('../app/features/cart/cart/cart').then(m => m.Cart)
    },
    {
        path: 'checkout',
        loadComponent: () => import('./features/checkout/checkout/checkout')
                .then(m => m.Checkout)
    },

    {
        path: 'orders',
        loadComponent: () =>
            import('./features/orders/order-list/order-list')
                .then(m => m.OrderList)
    },

    {
        path: 'orders/:id',
        loadComponent: () =>
            import('./features/orders/order-details/order-details')
                .then(m => m.OrderDetails)
    },

    {
        path: 'admin/dashboard',
        loadComponent: () =>
            import('./features/admin/dashboard/dashboard')
                .then(m => m.Dashboard)
    },

    {
        path: '**',
        redirectTo: 'products'
    }
];
