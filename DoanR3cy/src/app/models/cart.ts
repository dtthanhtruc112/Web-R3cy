

export class Cart {
    items?: CartItem[] ;
}

export class CartItem {
    id?: string;
    quantity?: number;

}

export class CartItemDetailed {
    product?: any;
    quantity?: number;

}