# Global E-Commerce Order Management Platform

A frontend e-commerce application built with **Angular 21**, designed to provide customer shopping functionality and an admin order/product management system.

## Features

### Customer

- User authentication
- Product listing
- Product search, filtering and sorting
- Product details
- Shopping cart management
- Checkout
- Order history
- Order details
- Order tracking
- Light/Dark theme

### Admin

- Admin authentication
- Admin dashboard
- Product management
- Add, edit and delete products
- Order management
- Order details

## Tech Stack

- **Angular 21**
- **TypeScript**
- **RxJS**
- **Angular Signals**
- **Angular Router**
- **Reactive Forms**
- **Vitest**
- **HTML5 / CSS3**

## Project Structure

```text
src/app/
├── core/
│   ├── guards/
│   └── models/
│
├── features/
│   ├── auth/
│   ├── products/
│   ├── cart/
│   ├── checkout/
│   ├── orders/
│   └── admin/
│
├── shared/
│   ├── components/
│   └── services/
│
├── app.config.ts
├── app.routes.ts
└── app.ts
```

The application follows a **feature-based architecture** to keep business functionality separated and maintainable.

## Mock Data

Since this submission focuses on frontend implementation, local JSON files are used to simulate backend APIs.

```text
src/assets/data/
├── products.json
├── orders.json
└── users.json
```

Angular services are responsible for accessing and managing this data.

## Authentication

The application supports two roles:

- User
- Admin

Authentication state is managed using Angular Signals and persisted using `sessionStorage`.

### User Credentials

```text
Email: user@ec.com
Password: Reset@123
```

### Admin Credentials

```text
Email: admin@ec.com
Password: Reset@123
```

> These credentials are for the frontend mock authentication flow only.

## Getting Started

### Prerequisites

- Node.js
- npm
- Angular CLI

### Installation

Clone the repository:

```bash
git clone https://github.com/rishabhrk3333-sudo/global-ecommerce-frontend.git
```

Navigate to the project:

```bash
cd global-ecommerce-frontend
```

Install dependencies:

```bash
npm install
```

## Development Server

Start the application:

```bash
ng serve
```

Then open:

```text
http://localhost:4200/
```

## Production Build

To create a production build:

```bash
ng build
```

The build output will be generated in the `dist/` directory.

## Running Unit Tests

The project uses **Vitest** for unit testing.

Run the complete test suite:

```bash
ng test
```

Unit tests cover important services and components including authentication, products, cart, orders, dashboard and admin functionality.

## Known Limitations

This is a frontend-focused implementation, so:

- Backend APIs are simulated using local JSON data.
- Authentication is mocked and does not use a real authentication server.
- No database is connected.
- No real payment gateway is integrated.
- Product/order persistence is limited to frontend storage and in-memory state.

## Future Improvements

- REST API integration
- JWT authentication
- Database integration
- Real payment gateway
- Server-side pagination
- Image upload
- End-to-end testing
- CI/CD pipeline

## Repository

GitHub:
https://github.com/rishabhrk3333-sudo/global-ecommerce-frontend

## Author

**Rishabh Kumar**

Frontend Developer | Angular
