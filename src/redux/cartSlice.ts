import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface cartItem {
    id: string;
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
  quantity: number;
  stock?: number;
  inStock?: boolean;
  tags?: string[];
  brand?: string;
  specifications?: { [key: string]: string };
  seller?: {
    name?: string;
    rating?: number;
  };
}

interface cartState {
    items: cartItem[]
}

const initialState : cartState = {
    items: JSON.parse(localStorage.getItem('cart_items') || '[]')
}

const saveToLocal = (items: cartItem[]) => {
    try {
        localStorage.setItem('cart_items', JSON.stringify(items))
    } catch (e) {
        // ignore localStorage failures
    }
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addItem: (state, action: PayloadAction<cartItem>) => {
            const existingItem = state.items.find((item) => item.id === action.payload.id)
            if (existingItem && existingItem.quantity) {
                existingItem.quantity += action.payload.quantity
            } else {
                state.items.push(action.payload)
            }
            saveToLocal(state.items)
        },
        removeItem: (state, action: PayloadAction<{id: string}>) => {
            state.items = state.items.filter((item) => item.id !== action.payload.id)
            saveToLocal(state.items)
        },
        updateQuantity: (state, action: PayloadAction<{id: string, quantity: number}>) => {
            const item = state.items.find(i => i.id === action.payload.id)
            if (item) {
                item.quantity = action.payload.quantity
                if (item.quantity <= 0) {
                    state.items = state.items.filter(i => i.id !== action.payload.id)
                }
            }
            saveToLocal(state.items)
        },
        clearCart: (state) => {
            state.items = []
            saveToLocal(state.items)
        },
        // Replace cart with server authoritative cart
        setCart: (state, action: PayloadAction<{items: cartItem[]}>) => {
            state.items = action.payload.items
            saveToLocal(state.items)
        },
        // Merge server cart into local cart (adds quantities)
        mergeCart: (state, action: PayloadAction<{items: cartItem[]}>) => {
            const incoming = action.payload.items
            for (const inc of incoming) {
                const existing = state.items.find(i => i.id === inc.id)
                if (existing) {
                    existing.quantity = Math.max(existing.quantity, inc.quantity)
                } else {
                    state.items.push(inc)
                }
            }
            saveToLocal(state.items)
        }
    }
})

export const { addItem, removeItem, clearCart, updateQuantity, setCart, mergeCart } = cartSlice.actions;
export default cartSlice.reducer
