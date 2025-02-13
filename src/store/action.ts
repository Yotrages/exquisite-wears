export enum CartActionType {
    ADD_ITEM = 'ADD_ITEM',
    REMOVE_ITEM = 'REMOVE_ITEM',
    CLEAR_CART = 'CLEAR_CART'
}

export interface cartItem {
    name: string;
    price: number;
    quantity: number;
    image: string;
    id: number
}

export interface CartArray {
    items: cartItem[];
}

interface addItemAction {
    type: CartActionType.ADD_ITEM,
    payload: cartItem;
}

interface removeItem {
    type: CartActionType.REMOVE_ITEM,
    payload: number;
}
interface clearCart {
   type: CartActionType.CLEAR_CART,
}

export type cartAction = addItemAction | removeItem | clearCart