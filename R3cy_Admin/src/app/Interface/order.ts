export interface Product {
    id: number;
    category1: string;
    category2: string;
    name: string;
    price: number;
    quantity: number;
    productValue?: number;
    feedback: string;
    img1:String,
  }
  
  export interface Order {
    userid: number,
    channel: string,
    ordernumber: number;
    products: Product[];
    order_status: string;
    ordereddate: string;
    paymentmethod: string;
    paymentstatus: boolean;
    totalOrderValue?: number;
    shippingfee?: number;
    discount?: Number;
    totalAmount?: Number;
    address: String
  } 