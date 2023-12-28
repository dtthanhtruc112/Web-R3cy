import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { product } from '../Interface/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  _url: string = "http://localhost:3000/product";

  constructor(private _http: HttpClient) { }

  getData(): Observable<product[]> {
    return this._http.get<product[]>(this._url);
  }

  getProductById(id: number): Observable<product | undefined> {
    return this._http.get<product[]>(this._url).pipe(
      map((products: any[]) => products.find((product: { id: number; }) => product.id === id) ?? undefined)
    );
  }
}
