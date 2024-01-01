import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { product } from '../Interface/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  _url: string = "http://localhost:3000/product";
  apiUrl:  string = "http://localhost:3000";

  constructor(private _http: HttpClient) { }

  getData(): Observable<product[]> {
    return this._http.get<product[]>(this._url);
  }

  getProductById(id: any): Observable<product | undefined> {
    return this._http.get<product[]>(this._url).pipe(
      map((products: any[]) => {
        const product = products.find((productt: product) => productt._id === id);
        console.log('Product:', product);
        return product ?? undefined;
      })
    );
  }


  updateProduct(updatedProduct: any): Observable<any> {
    const url = `${this.apiUrl}/${updatedProduct.id}`;
    return this._http.patch(url, updatedProduct);
  }

  deleteProduct(productId: string): Observable<any> {
    const url = `${this.apiUrl}/${productId}`;
    return this._http.delete(url);
  }

  addProduct(product: any): Observable<any> {
    return this._http.post(`${this.apiUrl}/product`, product);
  }
}
