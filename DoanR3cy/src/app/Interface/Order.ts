export interface Product {
    id: number;
    category1: string;
    category2: string;
    name: string;
    price: number;
    quantity: number;
    productValue?: number;
    danhgia: string
  }
  
  export interface Order {
    ordernumber: number;
    products: Product[];
    status: string;
    totalOrderValue?: number;
  }
  
  export interface UserOrders {
    userid: number;
    ngaytao: string;
    thanhtoan: string;
    orders: Order[];
  }
  