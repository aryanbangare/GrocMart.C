export interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  discountPrice: number;
  availableQuantity: number;
}

export interface CartItem {
  cartId?: number;
  productId: number;
  quantity: number;
  productName?: string;
  price?: number;
}

export interface LoginPayload {
  name: string;
  passwordHash: string;
}

export interface RegisterPayload {
  name: string;
  passwordHash: string;
}

export interface AddToCartPayload {
  userId: number;
  productId: number;
  quantity: number;
}

export interface UpdateCartPayload {
  cartId: number;
  userId: number;
  productId: number;
  quantity: number;
}

export interface CheckoutItemPayload {
  productId: number;
  quantity: number;
  price: number;
}

export interface CheckoutPayload {
  userId: number;
  totalAmount: number;
  items: CheckoutItemPayload[];
}

export interface AuthUser {
  userId?: number;
  id?: number;
  userID?: number;
  userIdValue?: number;
  name?: string;
}

export interface ApiResult<T> {
  ok: boolean;
  status: number;
  data: T | null;
  message: string;
}
