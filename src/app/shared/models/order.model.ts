export type PaymentMethod = 'STRIPE' | 'PAYPAL';
export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED';
export type OrderStatus =
  'PLACED' | 'PAYMENT_CONFIRMED' | 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: number;
  date: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
}
