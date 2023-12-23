import { Component, ElementRef, OnInit, Renderer2, ViewChild, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { BlogService } from '../Service/blog.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpErrorResponse } from '@angular/common/http';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { Router } from '@angular/router';

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
  authorInputValue: string = '';

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    minHeight: '5rem',
    placeholder: 'Nhập nội dung bài viết...',
    translate: 'no',
    sanitize: false, // Tắt chế độ làm sạch để chấp nhận HTML đầy đủ
  };

  constructor(private sanitizer: DomSanitizer, private blogService: BlogService, private router: Router) {}

  ngOnInit(): void {}

  // Function để chuyển hình ảnh thành base64
  private convertImageToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Sự kiện khi hình ảnh được chọn
  async displayImage(event: any): Promise<void> {
    const input = this.fileInput?.nativeElement as HTMLInputElement;
    const image = this.selectedImage?.nativeElement as HTMLImageElement;

    if (input?.files && input.files[0]) {
      this.imageSrc = await this.convertImageToBase64(input.files[0]);
      image.src = this.imageSrc;
      console.log('Base64 Image:', this.imageSrc);
    }
  }

  // Hàm tạo blog
  createBlog(): void {
    if (!this.imageSrc) {
      console.error('Hình ảnh chưa được chọn.');
      return;
    }

    console.log('Thumbnail to be sent:', this.imageSrc.split(',')[1]);
    // Gọi service để tạo blog
    this.blogService.createBlog({
      title: this.titleInputValue,
      author: this.authorInputValue,
      content: this.blogContent,
      thumbnail: this.imageSrc.split(',')[1]
    }).subscribe(
      (response) => {
        // Xử lý khi tạo blog thành công
        console.log('Tạo blog thành công', response);
        alert('Blog đã được tạo thành công!');
        // Đặt lại giá trị của các trường sau khi tạo blog thành công
        this.titleInputValue = '';
        this.authorInputValue = '';
        this.blogContent = '';
        this.imageSrc = '';
        // Chuyển hướng về trang quản lý blog
        // this.router.navigate(['/blog']);
      },
      (error) => {
        // Xử lý khi có lỗi
        console.error('Đã xảy ra lỗi khi tạo blog:', error);

        if (error instanceof HttpErrorResponse) {
          console.error('Lỗi từ server:', error);
          alert('Đã xảy ra lỗi khi tạo blog: ' + (error.error.message || 'Lỗi không xác định'));
        } else {
          alert('Đã xảy ra lỗi khi tạo blog. Vui lòng thử lại!');
        }
      }
    );
  }
}
