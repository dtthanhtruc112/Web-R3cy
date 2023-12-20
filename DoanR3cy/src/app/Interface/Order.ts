export interface Product {
  id: number;
  category1: string;
  category2: string;
  name: string;
  description: string;
  opt1: string;
  opt2: string;
  price: string;
  oldprice: string;
  img1: string;
  img2: string;
  img3: string;
  rate: number;
  avt1: string;
  accountfb1: string;
  fb1: string;
  ask1: string;
  answer1: string;
  ask2: string;
  answer2: string;
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
} 