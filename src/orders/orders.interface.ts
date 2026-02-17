export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  REFUNDED = 'REFUNDED',
}

export interface OrderItemResponse {
  id: string;
  imdbId: string;
  price: number;
  movie?: {
    title: string;
    poster: string | null;
  };
}

export interface OrderResponse {
  orderId: string;
  userId: string;
  totalAmount: number;
  status: OrderStatus;
  createdAt: Date;
  items: OrderItemResponse[];
}
