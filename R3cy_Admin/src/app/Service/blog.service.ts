import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
    private apiUrl = "http://localhost:3000";  
  
    constructor(private http: HttpClient) {}
  
    // tạo blog
    // createBlog(blogData: any): Observable<any> {
    //   return this.http.post(`${this.apiUrl}/createBlog`, blogData);
    // }
    createBlog(formData: FormData): Observable<any> {
      return this.http.post<any>(`${this.apiUrl}/createBlog`, formData);
    }
    
    // Phương thức xóa blog
    deleteBlog(blogId: string): Observable<any> {
      return this.http.delete(`${this.apiUrl}/blog/${blogId}`);
    }
    // Lấy tất cả các bài viết
  getAllBlogs(): Observable<any> {
    return this.http.get(`${this.apiUrl}/blog`).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }
  private handleError(error: any) {
    console.error('Có lỗi xảy ra:', error);
    return throwError('Có lỗi xảy ra, vui lòng thử lại sau.'); 
  }
  
}
