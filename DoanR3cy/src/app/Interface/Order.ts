export interface Product {
    id: number;
    category1: string;
    category2: string;
    name: string;
    price: number;
    quantity: number;
    productValue?: number;
  }
  
  export interface Order {
    ordernumber: number;
    products: Product[];
    status: string;
    danhgia: string;
    totalOrderValue?: number;
  }
  
  export interface UserOrders {
    userid: number;
    orders: Order[];
  }
  