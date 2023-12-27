import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { BlogService } from '../Service/blog.service';
import { Router } from '@angular/router';
import * as imageSize from 'image-size';

@Component({
  selector: 'app-admin-create-blog',
  templateUrl: './admin-create-blog.component.html',
  styleUrls: ['./admin-create-blog.component.css']
})
export class AdminCreateBlogComponent {
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
    sanitize: false,
  };

  constructor(private blogService: BlogService, private router: Router) {}

  private convertImageToBlob(file: File): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(new Blob([reader.result as ArrayBuffer], { type: file.type }));
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }

  async displayImage(event: any): Promise<void> {
    const input = this.fileInput?.nativeElement as HTMLInputElement;
    const image = this.selectedImage?.nativeElement as HTMLImageElement;

    if (input?.files && input.files[0]) {
      const blob = await this.convertImageToBlob(input.files[0]);
      this.imageSrc = URL.createObjectURL(blob);
      image.src = this.imageSrc;
      console.log('Blob:', blob);
    }
  }

  

  createBlog(): void {
    if (!this.imageSrc) {
      console.error('Hình ảnh chưa được chọn.');
      return;
    }
  
    const formData = new FormData();
    formData.append('title', this.titleInputValue);
    formData.append('author', this.authorInputValue);
    formData.append('content', this.blogContent);
    formData.append('thumbnail', this.fileInput.nativeElement.files[0]); // Sử dụng input.files[0] trực tiếp
  
    this.blogService.createBlog(formData).subscribe(
      (response) => {
        console.log('Tạo blog thành công', response);
        alert('Blog đã được tạo thành công!');
        this.titleInputValue = '';
        this.authorInputValue = '';
        this.blogContent = '';
        this.imageSrc = '';
      },
      (error) => {
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