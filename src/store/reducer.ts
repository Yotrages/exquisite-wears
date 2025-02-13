import { CartActionType, cartAction, CartArray } from "./action";

const initialState : CartArray = {
    items: []
}

export const cartReducer = (state = initialState, action: cartAction): CartArray => {
    switch (action.type) {
        case CartActionType.ADD_ITEM: 
        const existingItem = state.items.find((item) => item.id === action.payload.id)
        if (existingItem) {
          const updatedItems = state.items.map((items) =>   {
            items.id === action.payload.id &&
           {...items, quantity: action.payload.quantity += items.id}
          })
          return {...state, items: updatedItems}
        }
        
        return {...state, items: [...state.items, action.payload]};
        case CartActionType.REMOVE_ITEM:
           return {
            ...state, items: state.items.filter((item) => item.id !== action.payload)
           }
           case CartActionType.CLEAR_CART:
            return {...state, items: []}
            default: 
            return state
    }
}