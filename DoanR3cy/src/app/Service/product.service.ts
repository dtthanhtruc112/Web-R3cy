import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, filter, map, of, retry, tap } from 'rxjs';
import { product } from '../Interface/product';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
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
  apiurl: string = "http://localhost:3000";
  
  constructor(private _http: HttpClient,
    private authService: AuthService, // Inject AuthService
    private router: Router) { }


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
   addToCart(productId: string, quantity: number): Observable<any> {
      const url = `${this.apiurl}/cart/add`;

    // Lấy thông tin người dùng hiện tại từ AuthService
    const userId = this.authService.getUserId();

    // Kiểm tra xem người dùng đã đăng nhập hay chưa
    if (userId) {
      // Nếu đã đăng nhập, thực hiện hàm thêm vào giỏ hàng với userId
      return this._http.post(url, { productId, quantity, userId });
    } else {
      // Nếu chưa đăng nhập, chuyển hướng người dùng sang trang đăng nhập
      this.router.navigate(['/login']);
      // Trả về một Observable để không gây lỗi khi subscribe
      return new Observable();
    }
  }
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
