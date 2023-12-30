
export interface CartItem {
    id: number;
    subtotal?: number; // Thuộc tính mới
    category1: string;
    category2: string;
    img1: string;
    name: string;
    price: number;
    quantity: number;
  }
  
  export interface Cart {
    userid: number;
    cartItems: CartItem[];
  }
  