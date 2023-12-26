import { Component, OnInit } from '@angular/core';
import { BlogService } from '../Service/blog.service';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-manage-blog',
  templateUrl: './manage-blog.component.html',
  styleUrl: './manage-blog.component.css'
})
export class ManageBlogComponent implements OnInit  {

  blogs: any[] = [];

  constructor(private blogService: BlogService, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.getAllBlogs();
  }

  getAllBlogs() {
    this.blogService.getAllBlogs().subscribe(
      (response) => {
        this.blogs = response;

        // Chuyển đổi base64 thành SafeResourceUrl
        this.blogs.forEach(blog => {
          blog.thumbnail = this.sanitizer.bypassSecurityTrustResourceUrl(blog.thumbnail);
        });
      },
      (error) => {
        console.error('Đã xảy ra lỗi khi lấy dữ liệu blog:', error);
      }
    );
  }
}