
import { Component, OnInit } from '@angular/core';
import { BlogPost } from '../Interface/blogPost';
import { BlogService } from '../Service/blog.service';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detail-blog',
  templateUrl: './detail-blog.component.html',
  styleUrls: ['./detail-blog.component.css']
})
export class DetailBlogComponent implements OnInit {
 
  relatedBlogs: BlogPost[] = [];

  blog: BlogPost | null = null;

  constructor(
    private blogService: BlogService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  
  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const blogId = params.get('id');
      if (blogId) {
        this.blogService.getBlogById(blogId).subscribe((data: BlogPost) => {
          this.blog = data;
        });
       // Lấy các bài viết mới nhất
       this.blogService.getLatestBlogs().subscribe((data: BlogPost[]) => {
        // Loại bỏ bài viết chi tiết khỏi danh sách các bài viết mới nhất
        this.relatedBlogs = data.filter(blog => blog._id !== blogId);
      });
      } else {
        // Redirect to the blog list page or handle the case where id is null
        this.router.navigate(['/blog']);
      }
    });
  }
  viewRelatedBlogDetails(blogId: string): void {
    this.router.navigate(['/blog', blogId]);
  }
}
