/**
 * API Response Interfaces
 * These interfaces define the expected structure of responses from the backend
 * Used for type-safe API calls and data validation
 */

// ============ User/Auth Responses ============
export interface AuthResponse {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  token: string;
  createdAt?: string;
}

export interface UserResponse {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginResponse extends AuthResponse {}

export interface RegisterResponse extends AuthResponse {}

// ============ Product Responses ============
export interface ProductResponse {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  category?: string;
  quantity: number;
  inStock?: boolean;
  rating?: number;
  reviews?: number;
  brand?: string;
  sku?: string;
  tags?: string[];
  specifications?: Record<string, any>;
  seller?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductListResponse {
  products: ProductResponse[];
  totalPages: number;
  currentPage: number;
  total?: number;
}

export interface ProductCreateResponse {
  _id: string;
  message: string;
  product?: ProductResponse;
}

export interface ProductUpdateResponse {
  message: string;
  product?: ProductResponse;
}

export interface ProductDeleteResponse {
  message: string;
}

// ============ Cart Responses ============
export interface CartItemResponse {
  product: ProductResponse;
  quantity: number;
  _id?: string;
}

export interface CartResponse {
  _id: string;
  userId: string;
  items: CartItemResponse[];
  totalPrice: number;
  totalItems: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AddToCartResponse {
  message: string;
  cart?: CartResponse;
}

// ============ Order Responses ============
export interface OrderResponse {
  _id: string;
  userId: string;
  items: CartItemResponse[];
  totalPrice: number;
  totalItems: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod?: string;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  trackingNumber?: string;
  deliveryDate?: string;
  deliveredAt?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderListResponse {
  orders: OrderResponse[];
  total: number;
  page?: number;
  pages?: number;
}

export interface OrderCreateResponse {
  message: string;
  order?: OrderResponse;
}

// ============ Payment Responses ============
export interface PaymentResponse {
  _id: string;
  orderId: string;
  userId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  method: string;
  reference?: string;
  transactionId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaymentInitResponse {
  reference?: string;
  paymentUrl?: string;
  message?: string;
}

export interface PaymentVerifyResponse {
  message: string;
  payment?: PaymentResponse;
  order?: OrderResponse;
}

// ============ Wishlist Responses ============
export interface WishlistItemResponse {
  _id: string;
  product: ProductResponse;
  addedAt: string;
}

export interface WishlistResponse {
  _id: string;
  userId: string;
  items: WishlistItemResponse[];
  createdAt?: string;
  updatedAt?: string;
}

// ============ Review Responses ============
export interface ReviewResponse {
  _id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  helpful: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ReviewListResponse {
  reviews: ReviewResponse[];
  average: number;
  total: number;
}

// ============ Search Responses ============
export interface SearchResponse {
  name: string;
  image: string;
  _id: string;
  price: number;
  rating?: number;
  description?: string;
}

export interface SearchListResponse extends Array<SearchResponse> {}

// ============ Notification Responses ============
export interface NotificationResponse {
  _id: string;
  userId?: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt?: string;
}

export interface NotificationListResponse {
  notifications: NotificationResponse[];
  unread: number;
}

// ============ Contact Responses ============
export interface ContactResponse {
  message: string;
  _id?: string;
}

// ============ Subscribe Responses ============
export interface SubscribeResponse {
  message: string;
  _id?: string;
}

// ============ Password Reset Response ============
export interface PasswordResetResponse {
  message: string;
  success?: boolean;
}

// ============ Generic Error Response ============
export interface ErrorResponse {
  message: string;
  error?: string;
  status?: number;
  data?: any;
}

// ============ Generic Success Response ============
export interface SuccessResponse<T = any> {
  message: string;
  data?: T;
  status?: number;
}

// ============ Analytics Responses ============
export interface DashboardStatsResponse {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalInventoryValue: number;
}

export interface SalesAnalyticsResponse {
  topProducts: Array<{
    _id: string;
    totalOrders: number;
    totalRevenue?: number;
  }>;
  categoryAnalytics: Array<{
    _id: string;
    revenue: number;
    count: number;
  }>;
  revenue: number;
}

export interface InventoryAnalyticsResponse {
  lowStockItems: ProductResponse[];
  lowStockCount: number;
  outOfStockCount: number;
  totalValue: number;
}

export interface CustomerAnalyticsResponse {
  avgLTV: number;
  repeatCustomerCount: number;
  topCustomers: Array<{
    _id: string;
    customerName: string;
    totalSpent: number;
    orderCount: number;
  }>;
}

export interface PaymentAnalyticsResponse {
  successRate: number;
  failedCount: number;
  byMethod: Array<{
    _id: string;
    count: number;
  }>;
}

export interface PerformanceMetricsResponse {
  avgOrderValue: number;
  ordersPerDay: number;
  conversionRate: number;
  cartAbandonmentRate: number;
}

export interface AdminDashboardResponse {
  stats: DashboardStatsResponse;
  salesAnalytics: SalesAnalyticsResponse;
  inventoryAnalytics: InventoryAnalyticsResponse;
  customerAnalytics: CustomerAnalyticsResponse;
  paymentAnalytics: PaymentAnalyticsResponse;
  performanceMetrics: PerformanceMetricsResponse;
}
