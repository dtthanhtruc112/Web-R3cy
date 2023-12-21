import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
    private apiUrl = "http://localhost:3000";  
  
    constructor(private http: HttpClient) {}
  
    // tạo blog
    createBlog(blogData: any): Observable<any> {
      return this.http.post(`${this.apiUrl}/createBlog`, blogData);
    }
}
