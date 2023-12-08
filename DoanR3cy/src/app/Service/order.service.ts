import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, retry, catchError, throwError } from 'rxjs';
import { Order } from '../Interface/Order';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  _url: string = "./assets/data/order.json"

  constructor(private _http: HttpClient) { }
  getOrder(): Observable<Order[]>{
    return this._http.get<Order[]>(this._url).pipe(
      retry(3),
      catchError(this.handleErr)
    );
  }
  handleErr(err: HttpErrorResponse){
    return throwError(() => new Error(err.message))
  }

  getOrderById(id: number): Observable<any | undefined> {
    return this._http.get<any[]>(this._url).pipe(
      map(orders => orders.find(order => order.id === id))
    );
  }
}
