
import { Component, OnInit } from '@angular/core';
import { BlogPost } from '../Interface/blogPost';
import { BlogService } from '../blog.service';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-detail-blog',
  templateUrl: './detail-blog.component.html',
  styleUrls: ['./detail-blog.component.css']
})
export class DetailBlogComponent implements OnInit {
  blog: BlogPost | undefined;
  relatedBlogs: BlogPost[] = [];

  constructor(
    private blogService: BlogService,
    private route: ActivatedRoute
  ) {}

  
  ngOnInit(): void {
    this.route.paramMap.pipe(
      map(params => Number(params.get('id'))),
      switchMap(id => this.blogService.getBlogById(id).pipe(
        switchMap(blog => this.blogService.getBlogs().pipe(
          map(blogs => ({ blog, relatedBlogs: blogs.filter(b => b.id !== id).slice(0, 3) }))
        ))
      ))
    ).subscribe(data => {
      this.blog = data.blog;

      if (Array.isArray(data.relatedBlogs)) {
        this.relatedBlogs = data.relatedBlogs;
      } else if (typeof data.relatedBlogs === 'object' && data.relatedBlogs !== null) {
        this.relatedBlogs = [data.relatedBlogs as BlogPost];
      } else {
        console.error('Invalid related blogs data:', data.relatedBlogs);
        this.relatedBlogs = [];
      }
    });
  }
  // ngOnInit(): void {
  //   this.route.paramMap.pipe(
  //     map(params => Number(params.get('id'))),
  //     switchMap(id => this.blogService.getBlogById(id).pipe(
  //       switchMap(blog => this.blogService.getBlogs().pipe(
  //         map(blogs => ({ blog, relatedBlogs: blogs.filter(b => b.id !== id).slice(0, 3) }))
  //       ))
  //     ))
  //   ).subscribe(data => {
  //     this.blog = data.blog;

  //     if (Array.isArray(data.relatedBlogs)) {
  //       this.relatedBlogs = data.relatedBlogs;
  //     } else if (typeof data.relatedBlogs === 'object' && data.relatedBlogs !== null) {
  //       this.relatedBlogs = [data.relatedBlogs as BlogPost];
  //     } else {
  //       console.error('Invalid related blogs data:', data.relatedBlogs);
  //       this.relatedBlogs = [];
  //     }
  //   });
  // }
}
