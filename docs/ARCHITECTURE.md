# Application Architecture

## Overview

The Global E-Commerce Order Management Platform follows a **feature-based Angular architecture** designed to keep business functionality, reusable components, services, and application-wide logic separated.

The architecture focuses on:

- Separation of concerns
- Reusable components and services
- Maintainability
- Testability
- Scalable feature organization
- Clear separation between application-wide and feature-specific functionality

---

## Project Structure

```text
src/
├── app/
│   │
│   ├── core/
│   │   ├── guards/
│   │   └── models/
│   │
│   ├── features/
│   │   ├── auth/
│   │   ├── products/
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── orders/
│   │   └── admin/
│   │
│   ├── shared/
│   │   ├── components/
│   │   └── services/
│   │
│   ├── app.config.ts
│   ├── app.routes.ts
│   ├── app.ts
│   └── app.html
│
├── assets/
│   └── data/
│       ├── products.json
│       ├── orders.json
│       └── users.json
│
└── styles.css
```

---

## Architectural Layers

The application can be viewed as the following layers:

```text
┌──────────────────────────────────────┐
│              UI Layer                │
│      Components / Templates          │
└──────────────────┬───────────────────┘
                   │
                   ▼
┌──────────────────────────────────────┐
│          Feature Layer               │
│ Products / Cart / Orders / Admin     │
└──────────────────┬───────────────────┘
                   │
                   ▼
┌──────────────────────────────────────┐
│          Shared Services             │
│ Product / Order / Cart / Auth        │
└──────────────────┬───────────────────┘
                   │
                   ▼
┌──────────────────────────────────────┐
│       Data / Storage Layer           │
│     JSON Data / Browser Storage      │
└──────────────────────────────────────┘
```

---

## Core

The `core` directory contains application-wide functionality that is not specific to a single feature.

```text
core/
├── guards/
└── models/
```

### Models

The models define the application's data structures.

Examples include:

- Product
- Order
- Cart
- User

Using TypeScript interfaces provides type safety throughout the application.

### Guards

Route guards are responsible for protecting restricted routes.

The application uses guards for:

- Authentication
- Admin authorization

This prevents unauthenticated users from accessing protected areas and restricts admin functionality to authorized users.

---

## Features

The `features` directory contains the main business functionality of the application.

Each feature owns its components and functionality instead of placing everything into a single large component structure.

### Authentication

Responsible for:

- Login
- Logout
- User authentication flow
- Role-based access

### Products

Responsible for customer product functionality:

- Product listing
- Product search
- Category filtering
- Product sorting
- Product details

### Cart

Responsible for:

- Adding products
- Updating quantities
- Removing products
- Clearing the cart
- Calculating cart totals

### Checkout

Responsible for the checkout workflow and order submission.

### Orders

Responsible for:

- Order history
- Order details
- Order tracking

### Admin

Contains administrator-specific functionality.

```text
admin/
├── dashboard/
├── admin-product-list/
├── admin-orders/
└── ...
```

Admin functionality includes:

- Dashboard
- Product management
- Add product
- Edit product
- Delete product
- Order management
- Order details

---

## Shared

The `shared` directory contains functionality that can be reused by multiple features.

```text
shared/
├── components/
└── services/
```

### Shared Components

Examples include:

- Header
- Loader
- Empty State

These components are designed to be reusable across different parts of the application.

### Shared Services

The main services include:

#### ProductService

Handles product data operations:

- Get products
- Get product by ID
- Add product
- Update product
- Delete product

#### OrderService

Handles:

- Get orders
- Get order by ID

#### CartService

Handles:

- Cart state
- Add/remove products
- Quantity updates
- Cart subtotal
- Cart item count
- Local storage persistence

#### AuthService

Handles:

- Login
- Logout
- Current user state
- Authentication state
- Session storage

#### ThemeService

Handles application theme preferences.

---

## State Management

The application uses **Angular Signals** for reactive state management.

Signals are used for state such as:

- Current user
- Login status
- Cart items
- Cart item count
- Cart subtotal
- Product loading state
- Order loading state
- Dashboard statistics

Computed signals are used when values depend on other reactive state.

For example:

```text
Cart Items
    │
    ├──► Item Count
    │
    └──► Subtotal
```

This keeps derived state automatically synchronized with the underlying state.

---

## Data Flow

The application uses services as the main data-access layer.

For example, product data flows through the application as follows:

```text
ProductList Component
        │
        ▼
ProductService
        │
        ▼
HttpClient
        │
        ▼
products.json
        │
        ▼
Observable<Product[]>
        │
        ▼
Component Signal
        │
        ▼
UI
```

Similarly, order-related functionality follows:

```text
Order Component
      │
      ▼
OrderService
      │
      ▼
HttpClient
      │
      ▼
orders.json
      │
      ▼
Observable<Order[]>
      │
      ▼
Component State
```

---

## Mock Backend Strategy

Because this project is focused on frontend evaluation, local JSON files are used to simulate backend APIs.

```text
assets/data/
├── products.json
├── orders.json
└── users.json
```

Angular services abstract the data source from the components.

This means components do not directly access JSON files. Instead:

```text
Component
    ↓
Service
    ↓
Data Source
```

This makes it easier to replace the mock data source with real REST APIs in the future without significantly changing the component layer.

---

## Authentication Architecture

Authentication state is managed through `AuthService`.

```text
Login Form
    │
    ▼
AuthService
    │
    ├──► Validate User
    │
    ├──► Update Signal
    │
    └──► sessionStorage
```

The current authenticated user is exposed through a read-only Signal.

The application also exposes a computed `isLoggedIn` state.

Route guards use this authentication state to protect restricted routes.

---

## Routing Architecture

Angular Router is used for application navigation.

The application uses lazy-loaded standalone components where appropriate.

The routing structure separates public, authenticated, and admin functionality.

```text
Application
│
├── Public
│   ├── Products
│   └── Product Details
│
├── User
│   ├── Checkout
│   ├── Orders
│   ├── Order Details
│   └── Order Tracking
│
└── Admin
    ├── Dashboard
    ├── Products
    ├── Add/Edit Product
    ├── Orders
    └── Order Details
```

Authentication and authorization guards are applied to protected routes.

---

## Cart State and Persistence

The `CartService` manages cart state using an Angular Signal.

```text
CartService
     │
     ▼
cartItems Signal
     │
     ├──► itemCount
     │
     └──► subtotal
```

Cart data is persisted using `localStorage`.

This allows the cart to remain available after a page refresh.

The service also handles:

- Maximum item quantity
- Quantity updates
- Product removal
- Cart clearing

---

## Loading and Error Handling

Components maintain loading and error states for asynchronous operations.

A typical flow is:

```text
Start Request
     │
     ▼
Loading = true
     │
     ▼
Service Request
     │
     ├──────────────► Success
     │                   │
     │                   ▼
     │             Update State
     │                   │
     │                   ▼
     │             Loading = false
     │
     └──────────────► Error
                         │
                         ▼
                    Error State
                         │
                         ▼
                    Loading = false
```

This approach provides feedback to users during asynchronous operations.

---

## Admin Architecture

The admin section is isolated under the `features/admin` directory.

```text
Admin
 │
 ├── Dashboard
 │     ├── Total Products
 │     ├── Total Orders
 │     ├── Revenue
 │     └── Pending Orders
 │
 ├── Product Management
 │     ├── Product List
 │     ├── Add Product
 │     ├── Edit Product
 │     └── Delete Product
 │
 └── Order Management
       ├── Order List
       └── Order Details
```

The admin guard ensures that only authorized admin users can access these routes.

---

## Testing Architecture

The project uses **Vitest** with Angular testing utilities.

Components that depend on services use mocked service implementations.

```text
Component Test
      │
      ▼
Mock Service
      │
      ▼
Mock Observable
      │
      ▼
Component State
      │
      ▼
Assertions
```

For example, a service returning product data can be mocked using:

```ts
of(mockProducts);
```

This allows component tests to run independently of the actual data source.

---

## Separation of Concerns

The application follows a simple separation-of-concerns approach:

| Layer             | Responsibility                      |
| ----------------- | ----------------------------------- |
| Components        | UI and user interactions            |
| Services          | Data access and business logic      |
| Models            | Data structure and type definitions |
| Guards            | Authentication and authorization    |
| Shared Components | Reusable UI                         |
| Signals           | Reactive state                      |
| JSON Data         | Mock backend data                   |

This prevents components from becoming responsible for every part of the application's logic.

---

## Scalability

The current structure allows new features to be added without significantly changing existing functionality.

For example, additional features could be introduced as:

```text
features/
├── wishlist/
├── payments/
├── reviews/
└── notifications/
```

Services can also be updated to communicate with real backend APIs while keeping most UI components unchanged.

---

## Future Architecture Improvements

For a production implementation, the following improvements could be introduced:

- REST API integration
- JWT-based authentication
- Backend role-based authorization
- Database persistence
- Centralized API error handling
- HTTP interceptors
- Server-side pagination
- Real-time order updates
- End-to-end testing
- CI/CD integration

---

## Summary

The application uses a **feature-based Angular architecture** with:

- Standalone Angular components
- Angular Signals for reactive state
- RxJS for asynchronous operations
- Services for data access and business logic
- Route guards for authentication and authorization
- Shared reusable components
- TypeScript models for type safety
- Local JSON files for mock backend data
- Vitest for unit testing

This structure keeps the application modular, maintainable, testable, and ready to integrate with a real backend in the future.
