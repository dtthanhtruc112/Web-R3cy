import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, filter, map, of, retry, tap } from 'rxjs';
import { product } from '../Interface/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  // getProduct(id: string) {
  //   throw new Error('Method not implemented.');
  // }

  // getProduct(id: string): Observable<product> { // <-- Trả về Observable
  //   return this._http.get<any>(`/api/products/${id}`); // Ví dụ gọi API
  // }

  


  // _url: string = "./assets/data/product.json";

  _url: string = "http://localhost:3000/product";

  constructor(private _http: HttpClient) { }


  getProduct(id: string): Observable<product> {
    const url = `${this._url}/${id}`;
    return this._http.get<product>(url);
  }





  handleError(handleError: any): import("rxjs").OperatorFunction<product[], any> {
    throw new Error('Method not implemented.');
  }


  getData(): Observable<product[]> {
    return this._http.get<product[]>(this._url);
  }

  getProductById(id: number): Observable<product | undefined> {
    return this._http.get<product[]>(this._url).pipe(
      map(products => products.find(product => product.id === id) ?? undefined)
    );
  }

  getDataByCategory(category: string): Observable<product[]> {
    const url = `${this._url}/${category}`;
    return this._http.get<product[]>(url);
  }

  // getProductById(id: number): Observable<product | undefined> {
  //   return this._http.get<product[]>(this._url).pipe(
  //     map(products => products.find(product => product.id === id) ?? undefined)
  //   );
  // }

  // getProductById(id: number): Observable<product | undefined> {
  //   return this._http.get<product>(this._url + `/products/${id}`)
  //     .pipe(
  //       catch((error: HttpErrorResponse) => {
  //         if (error.status === 404) {
  //           return undefined;
  //         } else {
  //           throw error;
  //         }
  //       })
  //     );
  // }
  
}
