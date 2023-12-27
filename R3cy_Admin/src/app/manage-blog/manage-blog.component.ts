import { Component, OnInit } from '@angular/core';
import { BlogService } from '../Service/blog.service';
import { catchError, retry } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-manage-blog',
  templateUrl: './manage-blog.component.html',
  styleUrl: './manage-blog.component.css'
})
export class ManageBlogComponent implements OnInit  {
  
  blogs: any[] = [];
  errorMessage: string = '';

   constructor(private blogService: BlogService, private sanitizer: DomSanitizer, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.getAllBlogs();
  }
  getAllBlogs() {
    this.blogService.getAllBlogs().pipe(
      retry(3),
      catchError(this.handleError)
    ).subscribe(
      (response) => {
        this.blogs = response;
      },
      (error) => {
        console.error('Đã xảy ra lỗi khi lấy dữ liệu blog:', error);
        this.errorMessage = 'Đã xảy ra lỗi khi lấy dữ liệu blog.';
      }
    );
  }
  // Phương thức chỉnh sửa blog
  editBlog(blogId: string) {
    // Lấy thông tin blog cần chỉnh sửa
    const blogToEdit = this.blogs.find(blog => blog._id === blogId);

    // Kiểm tra xem blog có tồn tại không
    if (blogToEdit) {
      // Chuyển hướng đến trang chỉnh sửa với thông tin blog được truyền qua
      this.router.navigate(['/createblog'], { queryParams: { edit: 'true', id: blogId } });
    }
  }
  

  private handleError(error: any) {
    console.error('Có lỗi xảy ra:', error);
    return throwError('Có lỗi xảy ra khi lấy dữ liệu blog, vui lòng thử lại sau.');
  }


  // Thêm phương thức xóa blog
  deleteBlog(blogId: string) {
    const confirmDelete = window.confirm('Bạn chắc chắn muốn xóa bài viết này?');

    if (confirmDelete) {
      this.blogService.deleteBlog(blogId).subscribe(
        (response) => {
          // Nếu xóa thành công, cập nhật danh sách bài viết
          this.getAllBlogs();
        },
        (error) => {
          console.error('Đã xảy ra lỗi khi xóa blog:', error);
        }
      );
    }
  }
  
}