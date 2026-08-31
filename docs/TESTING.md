# Testing Documentation

## Overview

The Global E-Commerce Frontend uses **Vitest** with Angular testing utilities for unit testing.

The testing strategy focuses on validating important application behavior, services, and component interactions without requiring a real backend.

---

## Testing Tools

- **Vitest** – Test runner and assertion framework
- **Angular TestBed** – Creates and configures Angular testing environments
- **RxJS `of()`** – Used to provide mock Observable responses
- **Angular Signals** – Tested through their public signal values

---

## Running Tests

Run all unit tests:

```bash
ng test
```

Run tests in watch mode:

```bash
ng test --watch
```

### Run a Specific Test File

To run only a specific test file, use the Vitest file pattern:

```bash
ng test --include="**/product.service.spec.ts"
```

You can also use `describe.only()` during development when you want to temporarily focus on a particular test suite:

```ts
describe.only('ProductService', () => {
  // tests
});
```

> `describe.only()` should be removed before committing the final code so that the complete test suite can run.

---

## Testing Approach

The application uses **unit testing** to test components and services independently.

For components that depend on services, services are mocked instead of using the actual implementation.

Example:

```ts
{
  provide: ProductService,
  useValue: {
    getProducts: vi.fn().mockReturnValue(of(mockProducts)),
  },
}
```

This allows the component to be tested without making actual HTTP requests.

---

# Service Testing

Services are tested to verify their main business logic and data operations.

### ProductService

Important scenarios include:

- Loading products
- Getting a product by ID
- Adding a product
- Updating a product
- Deleting a product

The service's HTTP dependency is mocked using Angular's HTTP testing utilities where required.

### OrderService

Important scenarios include:

- Loading orders
- Getting an order by ID
- Returning `undefined` when an order does not exist

### CartService

Important scenarios include:

- Adding a product to the cart
- Increasing quantity for an existing product
- Updating quantity
- Removing a product
- Clearing the cart
- Calculating item count
- Calculating subtotal
- Persisting cart data using `localStorage`

### AuthService

Important scenarios include:

- Successful user login
- Successful admin login
- Invalid login
- Logout
- Maintaining authentication state
- Reading stored user information from `sessionStorage`

---

# Component Testing

Important components are tested by mocking their dependencies.

The tests focus on the component's main behavior rather than testing Angular framework internals.

### Product List

Tests cover important functionality such as:

- Component creation
- Loading products
- Search/filter behavior
- Category filtering
- Product sorting

### Product Details

Important scenarios include:

- Loading a product using the route ID
- Handling a missing product ID
- Increasing quantity
- Decreasing quantity
- Adding a product to the cart
- Navigating back to the product list

### Cart

Important scenarios include:

- Increasing product quantity
- Decreasing product quantity
- Removing products
- Clearing the cart
- Navigating to checkout

### Admin Product List

Important scenarios include:

- Loading products
- Updating the loading state
- Deleting a product

### Admin Dashboard

Important scenarios include:

- Loading products and orders
- Calculating total products
- Calculating total orders
- Calculating total revenue
- Calculating pending orders
- Getting recent orders

### Order Details / Order Tracking

Important scenarios include:

- Reading the order ID from the route
- Loading the order
- Handling missing order IDs
- Handling an order that does not exist
- Handling service errors
- Calculating item totals
- Checking order tracking status

### Header

Important scenarios include:

- Component creation
- Opening and closing navigation
- Opening and closing the user menu
- Logout behavior
- Navigation after logout

---

# Mocking Strategy

External dependencies are mocked to keep unit tests isolated.

For example, an `OrderService` can be mocked as:

```ts
const orderServiceMock = {
  getOrders: vi.fn().mockReturnValue(of(mockOrders)),
  getOrderById: vi.fn().mockReturnValue(of(mockOrder)),
};
```

The mocked service is then provided through Angular's dependency injection:

```ts
{
  provide: OrderService,
  useValue: orderServiceMock,
}
```

This ensures that tests do not depend on the actual JSON data or HTTP layer.

---

# Route Testing

Components that depend on `ActivatedRoute` are provided with a mocked route.

Example:

```ts
{
  provide: ActivatedRoute,
  useValue: {
    snapshot: {
      paramMap: {
        get: () => 'ORD-001',
      },
    },
  },
}
```

This allows components such as order details, order tracking, product details, and edit product to be tested with a predictable route parameter.

---

# Router Testing

Components that navigate using Angular Router use a router mock or Angular's router testing providers.

Example:

```ts
const routerMock = {
  navigate: vi.fn(),
  navigateByUrl: vi.fn(),
};
```

The test can then verify that the expected navigation occurred:

```ts
expect(routerMock.navigate).toHaveBeenCalledWith(['/products']);
```

---

# Test Data

Tests use small mock objects instead of relying on the complete application dataset.

Example product:

```ts
const mockProduct: Product = {
  id: 1,
  name: 'Laptop',
  description: 'Powerful laptop',
  price: 50000,
  image: 'laptop.jpg',
  stock: 10,
  category: 'Electronics',
  rating: 4.5,
};
```

Using small test data makes tests easier to understand and maintain.

---

# Test Isolation

Each test should be independent of other tests.

For example:

- Services are mocked where appropriate.
- Browser storage is cleared when required.
- Signals are initialized for each test.
- Mock functions are reset between tests.

This prevents one test from affecting another.

---

# Error Scenarios

Where applicable, tests also verify error handling.

Examples include:

- Product loading failure
- Order loading failure
- Missing route parameters
- Product/order not found
- Invalid authentication
- Invalid stored session data

Error scenarios verify that the application correctly updates its error and loading states.

---

# Testing Philosophy

The goal is not to test every line of code.

The tests focus primarily on **important business behavior and user-facing functionality**.

Priority is given to:

1. Core services
2. Authentication
3. Cart operations
4. Product operations
5. Order operations
6. Admin functionality
7. Important component interactions
8. Error handling

This provides useful test coverage while keeping the test suite maintainable.

---

# Current Testing Limitations

The current implementation focuses on unit testing.

The following areas can be added in a production environment:

- End-to-end testing
- Browser-based user-flow testing
- Accessibility testing
- Visual regression testing
- API integration testing
- Performance testing

---

# Future Improvements

Future testing improvements could include:

- Add Playwright or Cypress for E2E testing
- Increase coverage for edge cases
- Add automated coverage reports
- Add CI/CD test execution
- Add accessibility testing
- Add integration tests for complete user flows

Example E2E flow:

```text
Login
  ↓
Browse Products
  ↓
Open Product
  ↓
Add to Cart
  ↓
Checkout
  ↓
View Order
  ↓
Track Order
```

---

## Summary

The testing strategy provides focused unit coverage for the application's core services and components.

The combination of **Vitest, Angular TestBed, mocked services, RxJS Observables, Signals, and route/router mocks** allows the application to be tested independently and reliably.
