import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface WishlistItem {
  productId: string;
  product?: {
    _id: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
  };
  addedAt?: string;
}

interface WishlistState {
  items: WishlistItem[];
  loading: boolean;
}

const initialState: WishlistState = {
  items: [],
  loading: false,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    setWishlist: (state, action: PayloadAction<WishlistItem[]>) => {
      state.items = action.payload;
    },
    addToWishlist: (state, action: PayloadAction<WishlistItem>) => {
      const exists = state.items.find(item => item.productId === action.payload.productId);
      if (!exists) {
        state.items.push(action.payload);
      }
    },
    removeFromWishlist: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.productId !== action.payload);
    },
    clearWishlist: (state) => {
      state.items = [];
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setWishlist, addToWishlist, removeFromWishlist, clearWishlist, setLoading } = wishlistSlice.actions;
export default wishlistSlice.reducer;