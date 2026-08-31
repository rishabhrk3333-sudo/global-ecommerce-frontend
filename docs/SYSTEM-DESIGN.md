# Global E-Commerce Order Management Platform

## Frontend System Design

## 1. Overview

The Global E-Commerce Order Management Platform is a frontend-focused e-commerce application built using **Angular 21**.

The application provides two primary experiences:

- **Customer experience** – browsing products, managing a cart, checkout, viewing orders, and tracking orders.
- **Admin experience** – managing products, viewing orders, and monitoring overall business statistics.

The current implementation uses local JSON files as mock data sources because this submission focuses on frontend architecture and implementation.

The architecture is designed so that the mock data layer can be replaced with real backend APIs with minimal changes to the UI.

---

# 2. Goals

The primary goals of the application are:

- Provide a responsive e-commerce user interface.
- Implement customer and admin workflows.
- Maintain clear separation of concerns.
- Use reusable Angular components and services.
- Implement reactive state management using Angular Signals.
- Handle asynchronous operations using RxJS.
- Protect authenticated and admin routes.
- Provide maintainable and testable code.
- Keep the application ready for future backend integration.

---

# 3. High-Level Architecture

The application follows a **feature-based Angular architecture**.

```text
                         ┌──────────────────────┐
                         │       Browser        │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │    Angular Router    │
                         └──────────┬───────────┘
                                    │
                    ┌───────────────┴────────────────┐
                    │                                │
                    ▼                                ▼
          ┌──────────────────┐             ┌──────────────────┐
          │ Customer Features│             │  Admin Features  │
          │                  │             │                  │
          │ Products         │             │ Dashboard        │
          │ Cart             │             │ Products         │
          │ Checkout         │             │ Orders           │
          │ Orders           │             │ Order Details    │
          └────────┬─────────┘             └────────┬─────────┘
                   │                                │
                   └───────────────┬────────────────┘
                                   ▼
                         ┌──────────────────────┐
                         │   Shared Services    │
                         │                      │
                         │ ProductService       │
                         │ OrderService         │
                         │ CartService          │
                         │ AuthService          │
                         │ ThemeService         │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │    Data Sources      │
                         │                      │
                         │ products.json        │
                         │ orders.json          │
                         │ users.json           │
                         │ localStorage         │
                         │ sessionStorage       │
                         └──────────────────────┘
```

---

# 4. Technology Stack

| Technology      | Purpose                      |
| --------------- | ---------------------------- |
| Angular 21      | Frontend framework           |
| TypeScript      | Application development      |
| RxJS            | Asynchronous data handling   |
| Angular Signals | Reactive state management    |
| Angular Router  | Application navigation       |
| Reactive Forms  | Form handling and validation |
| HTML5           | Application structure        |
| CSS3            | Styling and responsive UI    |
| Vitest          | Unit testing                 |
| JSON            | Mock backend data            |

---

# 5. Application Modules

The application is organized into the following major areas:

```text
features/
├── auth/
├── products/
├── cart/
├── checkout/
├── orders/
└── admin/
```

Each feature is responsible for a specific business domain.

This prevents unrelated functionality from being tightly coupled.

---

# 6. Customer Flow

The main customer workflow is:

```text
Login
  │
  ▼
Products
  │
  ├── Search
  ├── Filter
  └── Sort
  │
  ▼
Product Details
  │
  ▼
Add to Cart
  │
  ▼
Cart
  │
  ▼
Checkout
  │
  ▼
Order
  │
  ├── Order Details
  └── Order Tracking
```

---

# 7. Admin Flow

The admin workflow is:

```text
Admin Login
     │
     ▼
Admin Dashboard
     │
     ├───────────────┐
     ▼               ▼
Products           Orders
     │               │
     ├── Add         ├── Order List
     ├── Edit        └── Order Details
     └── Delete
```

Admin routes are protected using authentication and authorization guards.

---

# 8. Routing Design

Angular Router is used for application navigation.

Conceptually, routes are divided into three groups:

```text
Routes
│
├── Public
│   ├── /products
│   └── /products/:id
│
├── Authenticated
│   ├── /cart
│   ├── /checkout
│   ├── /orders
│   ├── /orders/:id
│   └── /orders/:id/tracking
│
└── Admin
    ├── /admin/dashboard
    ├── /admin/products
    ├── /admin/products/add
    ├── /admin/products/edit/:id
    ├── /admin/orders
    └── /admin/orders/:id
```

Protected routes use guards to prevent unauthorized access.

---

# 9. Authentication Design

Authentication is handled through `AuthService`.

The current implementation uses mock users instead of a real authentication API.

The authentication flow is:

```text
Login Form
    │
    ▼
AuthService
    │
    ├── Validate Credentials
    │
    ▼
Create AuthUser
    │
    ├── Update Signal
    │
    └── Save to sessionStorage
```

The service exposes:

```text
currentUser
isLoggedIn
```

using Angular Signals.

The authenticated user's role determines whether admin functionality is available.

### Production Approach

In a production environment, authentication would be handled by a backend service using mechanisms such as:

- JWT or secure session-based authentication
- Refresh tokens
- Server-side role validation
- HTTP interceptors
- Secure cookie storage where appropriate

The frontend should never be responsible for making final authorization decisions.

---

# 10. Product Management

Product functionality is handled by `ProductService`.

The service provides operations for:

```text
GET products
GET product by ID
ADD product
UPDATE product
DELETE product
```

Current data flow:

```text
Product Component
       │
       ▼
ProductService
       │
       ▼
products.json
```

The service returns RxJS Observables for asynchronous operations.

For the current frontend-only implementation, add/update/delete operations update the in-memory application state.

In a production implementation, these operations would call REST APIs.

---

# 11. Product List Design

The product list supports:

- Search
- Category filtering
- Sorting
- Loading state
- Error state

The component uses Angular Signals for local reactive state.

```text
Products Signal
      │
      ├──► Categories
      │
      └──► Filtered Products
               │
               ├── Search
               ├── Category
               └── Sort
```

Computed Signals are used for derived values such as:

```text
categories
filteredProducts
```

This keeps the UI automatically synchronized with the source state.

---

# 12. Cart Architecture

The cart is managed centrally through `CartService`.

```text
                     CartService
                          │
                          ▼
                    cartItems Signal
                          │
              ┌───────────┴───────────┐
              ▼                       ▼
         itemCount                 subtotal
```

The service supports:

- Add product
- Update quantity
- Remove product
- Clear cart
- Maximum quantity handling
- Cart persistence

The current maximum quantity per product is:

```text
15
```

---

# 13. Cart Persistence

Cart data is stored in browser `localStorage`.

```text
Cart Signal
    │
    ▼
saveCart()
    │
    ▼
localStorage
```

When the application starts:

```text
localStorage
    │
    ▼
loadCart()
    │
    ▼
Cart Signal
```

This allows cart data to survive browser refreshes.

---

# 14. Order Management

Order functionality is handled by `OrderService`.

The service currently provides:

```text
getOrders()
getOrderById()
```

The order model contains:

- Order ID
- User ID
- Date
- Items
- Subtotal
- Shipping
- Total
- Payment method
- Payment status
- Order status

Supported payment methods:

```text
STRIPE
PAYPAL
```

Supported payment statuses:

```text
PENDING
SUCCESS
FAILED
```

Supported order statuses include:

```text
PLACED
PAYMENT_CONFIRMED
PENDING
PROCESSING
SHIPPED
DELIVERED
CANCELLED
```

---

# 15. Order Tracking

Order tracking uses the current order status to determine the progress of an order.

Conceptually:

```text
PENDING
   │
   ▼
PROCESSING
   │
   ▼
SHIPPED
   │
   ▼
DELIVERED
```

The component provides helper methods such as:

```text
isCompleted()
isCurrent()
```

to determine the state of each tracking step.

---

# 16. Admin Dashboard

The admin dashboard consumes both product and order data.

The dashboard calculates:

```text
Total Products
Total Orders
Total Revenue
Pending Orders
```

Data flow:

```text
ProductService ──────┐
                     │
                     ▼
                Dashboard
                     ▲
                     │
OrderService ────────┘
```

Revenue is calculated from the order totals.

Pending orders include orders with:

```text
PENDING
PROCESSING
```

The dashboard also provides recent orders by sorting orders based on date.

---

# 17. Data Strategy

Because this is a frontend-focused implementation, local JSON files are used instead of a real backend.

```text
assets/data/
├── products.json
├── orders.json
└── users.json
```

This approach provides predictable data for development and testing.

The important architectural decision is that components do not directly read JSON files.

Instead:

```text
Component
    ↓
Service
    ↓
Data Source
```

This abstraction makes future API integration easier.

---

# 18. API Migration Strategy

When a backend becomes available, the services can be changed without significantly changing the UI.

Current:

```text
ProductList
     ↓
ProductService
     ↓
products.json
```

Future:

```text
ProductList
     ↓
ProductService
     ↓
HttpClient
     ↓
REST API
     ↓
Backend
     ↓
Database
```

For example:

```text
GET    /api/products
GET    /api/products/:id
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
```

The component can continue consuming the same service methods.

---

# 19. State Management Strategy

The application uses Angular Signals instead of introducing a large global state-management library.

Signals are appropriate for the current application size because the state is relatively simple and localized.

Examples:

```text
AuthService
 ├── currentUser
 └── isLoggedIn

CartService
 ├── items
 ├── itemCount
 └── subtotal

ProductList
 ├── products
 ├── searchTerm
 ├── selectedCategory
 ├── selectedSort
 ├── isLoading
 └── isError
```

For a significantly larger application, a centralized state-management solution could be considered.

---

# 20. Error Handling

Asynchronous operations use RxJS subscription handlers.

Typical flow:

```text
Request
  │
  ├── Success ──► Update State
  │
  └── Error ────► Update Error State
```

Components maintain separate loading and error states where required.

For example:

```text
isLoading = true
     │
     ▼
API/Data Request
     │
     ├── Success → isLoading = false
     │
     └── Error   → isLoading = false
                   isError = true
```

In a production application, centralized error handling could be implemented using an HTTP interceptor.

---

# 21. Form Architecture

Reactive Forms are used for product-related forms and other structured user input.

The form layer is responsible for:

- Input validation
- Form state
- User input
- Validation feedback

The component passes validated form data to the appropriate service.

```text
Form
 │
 ▼
Validation
 │
 ▼
Component
 │
 ▼
Service
 │
 ▼
Data Source / API
```

---

# 22. Reusable Components

Common UI functionality is placed inside the shared component area.

Examples include:

```text
shared/components/
├── header/
├── loader/
└── empty-state/
```

This avoids duplicating common UI logic across feature components.

---

# 23. Testing Strategy

Unit testing is implemented using **Vitest** and Angular testing utilities.

The primary focus is on important business behavior.

Examples:

```text
ProductService
CartService
OrderService
AuthService
```

and important feature components such as:

```text
ProductList
ProductDetails
Cart
Dashboard
AdminProductList
OrderDetails
OrderTracking
Header
```

Dependencies are mocked where required.

Example:

```text
Component
    │
    ▼
Mock ProductService
    │
    ▼
Mock Observable
    │
    ▼
Component State
```

This keeps unit tests isolated from external data sources.

---

# 24. Security Considerations

The current implementation is a frontend demonstration and therefore does not provide production-level security.

For production:

### Authentication

Use backend-managed authentication rather than hardcoded frontend credentials.

### Authorization

Admin authorization must be validated by the backend.

### Payment

Payment information should never be handled directly by the frontend beyond secure integration with a payment provider.

### Storage

Sensitive authentication information should not be stored insecurely in browser storage.

### API Security

Production APIs should use:

- HTTPS
- Authentication
- Authorization
- Input validation
- Rate limiting
- Proper CORS configuration

---

# 25. Performance Considerations

The application uses several Angular features that help maintain performance:

- Standalone components
- Signals
- Computed Signals
- Feature-based architecture
- Reactive data handling
- Reusable components

For production scaling, additional optimizations could include:

- Lazy loading
- Server-side pagination
- API caching
- Image optimization
- Virtual scrolling for large datasets
- CDN usage
- Production build optimization

---

# 26. Scalability

The architecture is designed to allow additional features to be introduced independently.

Potential future features:

```text
features/
├── wishlist/
├── reviews/
├── payments/
├── notifications/
├── coupons/
└── user-profile/
```

Services can also be extended to support additional API operations.

---

# 27. Deployment Architecture

A production deployment could follow:

```text
                    Internet
                       │
                       ▼
                 CDN / Hosting
                       │
                       ▼
              Angular Frontend
                       │
                       ▼
                  REST API
                       │
                       ▼
                   Backend
                       │
                       ▼
                   Database
```

The Angular application can be deployed to platforms such as static hosting/CDN services.

The backend and database would be deployed independently.

---

# 28. Current Limitations

The current implementation intentionally uses a simplified frontend architecture because this assignment evaluates frontend skills.

Current limitations include:

- Mock JSON data instead of real APIs
- Mock authentication
- No real database
- No real payment integration
- No server-side authorization
- Browser storage for cart/session state
- No real-time order updates

These limitations can be addressed when connecting the application to a production backend.

---

# 29. Future Improvements

The following improvements are planned for a production-ready implementation:

1. Replace JSON data with REST APIs.
2. Implement secure authentication.
3. Add backend role-based authorization.
4. Integrate a real payment provider.
5. Add database persistence.
6. Add server-side pagination and filtering.
7. Add centralized HTTP error handling.
8. Add end-to-end testing.
9. Add CI/CD pipeline.
10. Add monitoring and logging.

---

# 30. Design Decisions Summary

| Decision                   | Reason                                      |
| -------------------------- | ------------------------------------------- |
| Feature-based architecture | Keeps business functionality modular        |
| Standalone components      | Simplifies Angular architecture             |
| Signals                    | Simple and reactive local/application state |
| RxJS                       | Handles asynchronous operations             |
| Services                   | Separates data/business logic from UI       |
| Route guards               | Protects restricted routes                  |
| Local JSON                 | Allows frontend development without backend |
| localStorage               | Persists cart state                         |
| sessionStorage             | Maintains current login session             |
| Vitest                     | Fast unit testing                           |
| Shared components          | Avoids UI duplication                       |

---

# 31. Conclusion

The Global E-Commerce Order Management Platform uses a modular, feature-based Angular architecture with clear separation between UI components, business services, application state, and data sources.

The current frontend implementation is intentionally independent of a backend, while the service-based architecture keeps the application ready for future REST API integration.

The overall design prioritizes:

- Maintainability
- Reusability
- Testability
- Scalability
- Separation of concerns
- Future backend integration
