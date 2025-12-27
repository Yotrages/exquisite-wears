export interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number; // final price after discount
  originalPrice?: number | null; // optional original price
  discount?: number; // percentage, e.g., 20 for 20%
  image?: string;
  images?: string[];
  rating?: number;
  reviews?: number;
  averageRating?: number;
  totalReviews?: number;
  category?: string;
  quantity?: number;
  stock?: number;
  inStock?: boolean;
  tags?: string[];
  brand?: string;
  specifications?: { [key: string]: any };
  seller?: {
    id?: string;
    name?: string;
    rating?: number;
  };
  views?: number;
  soldCount?: number;
  sku?: string;
}
