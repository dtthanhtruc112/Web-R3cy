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
export interface Address {
  country: string;
  postcodeZip: string;
  province: string;
  district: string;
  addressDetail: string;
}
export interface ClientInfo {
  clientname: string;
  clientphone: string;
  clientemail: string;
}
export interface Order {
  userid: number,
  channel: string,
  ordernumber: number;
  products: Product[];
  order_status: string;
  ordereddate: Date; // Sử dụng kiểu Date
  paymentmethod: string;
  paymentstatus: boolean;
  totalOrderValue?: number;
  // tổng giá sản phẩm, chưa có cộng trừ phụ phí
  shippingfee?: number;
  // phí vận chuyển
  discount?: number;
  // khuyến mãi
  totalAmount?: number;
  // tổng đơn hàng
  adress: Address,
  // địa chỉ đơn hàng
  clientInfo: ClientInfo,
  // thông tin người nhận
 orderNote: string, 
  id: string;
  // totalPrice: string;
  rejectreason: string;
  // lí do từ chối

} 

