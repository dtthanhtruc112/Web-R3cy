import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Discount } from '../Interface/discount';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DiscountService {

  _url: string = "http://localhost:3000/discount";
  apiUrl:  string = "http://localhost:3000";

  constructor(private _http: HttpClient) { }

  getData(): Observable<Discount[]> {
    return this._http.get<Discount[]>(this._url);
  }

  getDataDangapdung(): Observable<Discount[]> {
    return this._http.get<Discount[]>(`${this._url}/dang-ap-dung`);
  }

  getDataDalenlich(): Observable<Discount[]> {
    return this._http.get<Discount[]>(`${this._url}/da-len-lich`);
  }

  getDataDahethan(): Observable<Discount[]> {
    return this._http.get<Discount[]>(`${this._url}/da-het-han`);
  }

  getDiscountById(id: any): Observable<Discount | undefined> {
    return this._http.get<Discount[]>(this._url).pipe(
      map((discounts: any[]) => {
        const discount = discounts.find((discountt: Discount) => discountt._id === id);
        console.log('discount:', discount);
        return discount ?? undefined;
      })
    );
  }

  updateDiscount(updatedDiscount: any): Observable<any> {
    const url = `${this.apiUrl}/${updatedDiscount._id}`;
    return this._http.patch(url, updatedDiscount);
  }

  deleteDiscount(discountId: string): Observable<any> {
    const url = `${this.apiUrl}/${discountId}`;
    return this._http.delete(url);
  }

  addDiscount(discount: any): Observable<any> {
    return this._http.post(`${this.apiUrl}/discount`, discount);
  }
}
