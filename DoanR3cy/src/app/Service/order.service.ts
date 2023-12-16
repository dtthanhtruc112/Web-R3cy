import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, retry, catchError, throwError } from 'rxjs';
import { UserOrders, Order, Product } from '../Interface/Order';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  // saveReview(reviewData: ReviewData) {
  //   throw new Error('Method not implemented.');
  // }

  private _url: string = "./assets/data/order.json";

  constructor(private _http: HttpClient) { }

  getOrder(): Observable<UserOrders[]> {
    return this._http.get<UserOrders[]>(this._url).pipe(
      retry(3),
      catchError(this.handleErr)
    );
  }

  // getOrderById(id: number): Observable<Order | undefined> {
  //   return this._http.get<UserOrders[]>(this._url).pipe(
  //     map(userOrders => userOrders.flatMap(orderData => orderData.orders).find(order => order.ordernumber === id))
  //   );
  // }

  getOrderById(id: number): Observable<Order | undefined> {
    return this._http.get<UserOrders[]>(this._url).pipe(
      map(userOrders => {
        const foundOrderData = userOrders.find(orderData => orderData.orders.some(order => order.ordernumber === id));
        return foundOrderData ? foundOrderData.orders.find(order => order.ordernumber === id) : undefined;
      })
    );
  }

  getProductsByOrderId(id: number): Observable<Product[]> {
    return this.getOrderById(id).pipe(
      map(order => order ? order.products : [])
    );
  }

  getOrderByUserId(userId: number): Observable<Order[] | undefined> {
    return this._http.get<UserOrders[]>(this._url).pipe(
      map(userOrders => {
        const userData = userOrders.find(orderData => orderData.userid === userId);
        return userData ? userData.orders : undefined;
      }),
      retry(3),
      catchError(this.handleErr)
    );
  }

  private handleErr(err: HttpErrorResponse) {
    return throwError(() => new Error(err.message))
  }
  
}
