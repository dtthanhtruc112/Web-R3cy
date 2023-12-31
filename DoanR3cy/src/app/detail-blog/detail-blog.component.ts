
import { Component, ElementRef, OnInit, Renderer2  } from '@angular/core';
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
    private router: Router,
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  
  ngOnInit() {
    // Gọi hàm để xử lý CSS cho hình ảnh trong blog.content
    this.handleImageStyling();

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

   // Hàm để xử lý CSS cho hình ảnh trong blog.content
  //  handleImageStyling(): void {
  //   if (this.blog) {
  //     // Lấy tất cả các hình ảnh trong blog.content
  //     const contentImages = this.el.nativeElement.querySelectorAll('.contnentBlog img');
  //     console.log('contentImages', contentImages);

     
  //     // Xóa thuộc tính width và height
  //   contentImages.forEach((img: any) => {
  //     img.style.width = null;
  //     img.style.height = null;
  //   });

  //     // Áp dụng CSS cho từng hình ảnh (nếu cần)
  //     contentImages.forEach((img: any) => {
  //       this.renderer.addClass(img, 'content-image');
  //     });
  //   }
  // }
  handleImageStyling(): void {
    if (this.blog) {
      const contentImages = this.el.nativeElement.querySelectorAll('.contnentBlog img');
      
      contentImages.forEach((img: any) => {
        img.style.width = '';
        img.style.height = '';
      });
  
      // Áp dụng CSS cho từng hình ảnh (nếu cần)
      contentImages.forEach((img: any) => {
        this.renderer.addClass(img, 'content-image');
      });
    }
  }
  

  viewRelatedBlogDetails(blogId: string): void {
    this.router.navigate(['/blog', blogId]);
  }
}
