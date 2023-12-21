import { Component, ElementRef, OnInit, Renderer2, ViewChild, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { BlogService } from '../Service/blog.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-admin-create-blog',
  templateUrl: './admin-create-blog.component.html',
  styleUrl: './admin-create-blog.component.css'
})
export class AdminCreateBlogComponent {
  // Load ảnh
  @ViewChild('myfile') fileInput!: ElementRef;
  @ViewChild('selectedImage') selectedImage!: ElementRef;

  titleInputValue: string = '';
  blogContent: string = '';
  imageSrc: string = '';

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    minHeight: '5rem',
    placeholder: 'Nhập nội dung bài viết...',
    translate: 'no',
    sanitize: false, // Tắt chế độ làm sạch để chấp nhận HTML đầy đủ
  };

  constructor(private sanitizer: DomSanitizer, private blogService: BlogService) {}

  ngOnInit(): void {}

  // displayImage(event: any): void {
  //   const input = this.fileInput?.nativeElement as HTMLInputElement;
  //   const image = this.selectedImage?.nativeElement as HTMLImageElement;
  //   if (input?.files && input.files[0]) {
  //     const reader = new FileReader();
  //     reader.onload = function (e) {
  //       if (e?.target?.result) {
  //         image.src = e.target.result as string;
  //       }
  //     };
  //     reader.readAsDataURL(input.files[0]);
  //   }
  // }
  displayImage(event: any): void {
    const input = this.fileInput?.nativeElement as HTMLInputElement;
    const image = this.selectedImage?.nativeElement as HTMLImageElement;

    if (input?.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = function (e) {
        if (e?.target?.result) {
          image.src = e.target.result as string;
        }
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  selectImage() {
    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.value = null;
    }
  }

  createBlog() {
    // Làm sạch dữ liệu trước khi gửi đến server (nếu cần)
    // const sanitizedContent: SafeHtml = this.sanitizer.bypassSecurityTrustHtml(this.blogContent);

    // Gọi service để tạo blog
    this.blogService.createBlog({
      title: this.titleInputValue,  // Thay thế bằng title thực tế
      author: 'your-author',  // Thay thế bằng author thực tế
      content: this.blogContent,
      thumbnail: this.imageSrc
    }).subscribe(
      (response) => {
        // Xử lý khi tạo blog thành công
        console.log('Tạo blog thành công', response);
        alert('Blog đã được tạo thành công!');
      },
      (error) => {
        // Xử lý khi có lỗi
        console.error('Đã xảy ra lỗi khi tạo blog:', error);
  
        if (error instanceof HttpErrorResponse) {
          // Nếu là lỗi HTTP, kiểm tra thông báo lỗi từ server
          // console.error('Lỗi từ server:', error.error);
          // alert('Đã xảy ra lỗi khi tạo blog: ' + error.error.message || 'Lỗi không xác định');
          console.error('Lỗi từ server:', error);
          alert('Đã xảy ra lỗi khi tạo blog: ' + (error.error.message || 'Lỗi không xác định'));
        } else {
          // Nếu không phải là lỗi HTTP, hiển thị lỗi chung
          alert('Đã xảy ra lỗi khi tạo blog. Vui lòng thử lại!');
        }
      }
    );
  }
       
      }
//     );
//   }
// }
