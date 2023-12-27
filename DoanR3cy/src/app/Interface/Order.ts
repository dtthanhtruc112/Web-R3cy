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
  userid: number,
  channel: string,
  ordernumber: number;
  products: Product[];
  order_status: string;
  ordereddate: string;
  paymentmethod: string;
  paymentstatus: boolean;
  totalOrderValue?: number;
  shipfee: number;

  id: string;
  orderItems?: OrderItem[];
  street: string;
  city: string;
  zip: string;
  country: string;
  phone: string;
  totalPrice: string;
  rejectreason: string;

} 
export interface Orders {
 
  ordereddate: string;
  orderItems?: OrderItem[];
  street: string;
  city: string;
  zip: string;
  country: string;
  phone: string;

} 

export interface OrderItem {
  product?: string;
  quantity?: number;
}





