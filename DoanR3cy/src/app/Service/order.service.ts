import { HttpClient, HttpErrorResponse,  HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, retry, catchError, throwError } from 'rxjs';
import { Order, Product } from '../Interface/Order';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  // saveReview(reviewData: ReviewData) {
  //   throw new Error('Method not implemented.');
  // }

  private _url: string = "http://localhost:3000";

  constructor(private _http: HttpClient) { }


  createOrder(userId: number, orderData: any): Observable<Order> {
    const url = `${this._url}/orders/user/${userId}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this._http.post<Order>(url, orderData, { headers }).pipe(
      catchError((error) => {
        console.error('Error in createOrder:', error);
        return throwError(error);  // Chuyển lỗi để phía component xử lý
      })
    );
  }

  getOrder(userId: number): Observable<Order[]> {
    return this._http.get<Order[]>(`${this._url}/orders/user/${userId}`).pipe(
      retry(3),
      catchError(this.handleErr)
    );
  }

  

  handleErr(err: HttpErrorResponse) {
    return throwError(() => new Error(err.message));
  }

  updateOrderStatus(userId: number, orderNumber: number, status: string): Observable<Order> {
    const updateData = { order_status: status };

    return this._http.patch<Order>(`${this._url}/orders/user/${userId}/${orderNumber}`, updateData).pipe(
      catchError(this.handleErr)
    );
  }

  updateProductFeedback(userId: number, orderNumber: number, productId: number, feedback: string): Observable<Product> {
    const updateData = { feedback };

    return this._http.patch<Product>(`${this._url}/orders/user/${userId}/${orderNumber}/products/${productId}`, updateData).pipe(
      catchError(this.handleErr)
    );
  }

 

  

  // private _url: string = "http://localhost:3000";

  // constructor(private _http: HttpClient) {}

  // getProducts(): Observable<Product[]>{
  //   return this._http.get<Product[]>(`${this._url}/products`).pipe(
  //     retry(2),
  //     catchError(this.handleError)
  //   )
  // }

  // handleError(error: HttpErrorResponse) {
  //   return throwError(() => new Error(error.message))
  // }

  // getOrderById(id: number): Observable<any | undefined> {
  //   return this._http.get<any[]>(this._url).pipe(
  //     map(orders => orders.find(order => order.id === id))
  //   );
  // }

  // getOrder(): Observable<UserOrders[]> {
  //   return this._http.get<UserOrders[]>(this._url).pipe(
  //     retry(3),
  //     catchError(this.handleErr)
  //   );
  // }

  // // getOrderById(id: number): Observable<Order | undefined> {
  // //   return this._http.get<UserOrders[]>(this._url).pipe(
  // //     map(userOrders => userOrders.flatMap(orderData => orderData.orders).find(order => order.ordernumber === id))
  // //   );
  // // }

  // getOrderById(id: number): Observable<Order | undefined> {
  //   return this._http.get<UserOrders[]>(this._url).pipe(
  //     map(userOrders => {
  //       const foundOrderData = userOrders.find(orderData => orderData.orders.some(order => order.ordernumber === id));
  //       return foundOrderData ? foundOrderData.orders.find(order => order.ordernumber === id) : undefined;
  //     })
  //   );
  // }

  // getProductsByOrderId(id: number): Observable<Product[]> {
  //   return this.getOrderById(id).pipe(
  //     map(order => order ? order.products : [])
  //   );
  // }

  // getOrderByUserId(userId: number): Observable<Order[] | undefined> {
  //   return this._http.get<UserOrders[]>(this._url).pipe(
  //     map(userOrders => {
  //       const userData = userOrders.find(orderData => orderData.userid === userId);
  //       return userData ? userData.orders : undefined;
  //     }),
  //     retry(3),
  //     catchError(this.handleErr)
  //   );
  // }

  // private handleErr(err: HttpErrorResponse) {
  //   return throwError(() => new Error(err.message))
  // }
  
// getProduct(id: string): Observable<any> {
//   return this._http.get<any>(`${this._url}/${id}`)
// }



// apiURLProducts = environment.apiUrl + 'products'


}

