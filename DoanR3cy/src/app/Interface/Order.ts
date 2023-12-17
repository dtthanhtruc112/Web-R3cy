export interface Product {
    id: number;
    category1: string;
    category2: string;
    name: string;
    price: number;
    quantity: number;
    productValue?: number;
    feedback: string;
  }
  
  export interface Order {
    ordernumber: number;
    products: Product[];
    status: string;
    ordereddate: string;
    paymentmethod: string;
    paymentstatus: string;
    totalOrderValue?: number;
  }
  
  export interface UserOrders {
    userid: number;
    channel: string,
    orders: Order[];
  }
  