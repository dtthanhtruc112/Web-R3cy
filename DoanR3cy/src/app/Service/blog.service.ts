import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs';
import { BlogPost } from '../Interface/blogPost';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  // private jsonUrl = '../assets/data/blog.json';

  // constructor(private http: HttpClient) {}

  // getBlogs(): Observable<BlogPost[]> {
  //   return this.http.get<BlogPost[]>(this.jsonUrl, { responseType: 'json' });
  // }

  // getBlogById(id: number): Observable<BlogPost | undefined> {
  //   return this.http.get<BlogPost[]>(this.jsonUrl).pipe(
  //     map(posts => posts.find(post => post.id === id))
  //   );
  // }

  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getBlogs(): Observable<BlogPost[]> {
    return this.http.get<BlogPost[]>(`${this.apiUrl}/blog`);
  }

  getBlogById(blogId: string): Observable<BlogPost> {
    return this.http.get<BlogPost>(`${this.apiUrl}/blog/${blogId}`);
  }
}
