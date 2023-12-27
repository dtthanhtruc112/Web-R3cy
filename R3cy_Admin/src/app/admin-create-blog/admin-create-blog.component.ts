import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { BlogService } from '../Service/blog.service';
import { Router } from '@angular/router';
import * as imageSize from 'image-size';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-admin-create-blog',
  templateUrl: './admin-create-blog.component.html',
  styleUrls: ['./admin-create-blog.component.css']
})
export class AdminCreateBlogComponent {
  @ViewChild('myfile') fileInput!: ElementRef;
  @ViewChild('selectedImage') selectedImage!: ElementRef;

  isEdit: boolean = false;
  blogId: string = '';
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

  constructor(private blogService: BlogService, private router: Router, private route: ActivatedRoute) {}

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

  async ngOnInit(): Promise<void> {
    this.route.queryParams.subscribe(params => {
      this.isEdit = params['edit'] === 'true';
      this.blogId = params['id'] || '';
      if (this.isEdit && this.blogId) {
        this.getBlogForEdit(this.blogId);
      }
    });
  }

  getBlogForEdit(blogId: string): void {
    this.blogService.getBlogById(blogId).subscribe(
      (response) => {
        const blogData = response;
        this.titleInputValue = blogData.title;
        this.authorInputValue = blogData.author;
        this.blogContent = blogData.content;
        this.imageSrc = `http://localhost:3000/image/${blogData.thumbnail}`;
      },
      (error) => {
        console.error('Đã xảy ra lỗi khi lấy dữ liệu blog:', error);
      }
    );
  }

  async displayImage(event: any): Promise<void> {
    const input = this.fileInput?.nativeElement as HTMLInputElement;
    const image = this.selectedImage?.nativeElement as HTMLImageElement;

    if (input?.files && input.files[0]) {
      const blob = await this.convertImageToBlob(input.files[0]);
      this.imageSrc = URL.createObjectURL(blob);
      image.src = this.imageSrc;
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
    formData.append('thumbnail', this.fileInput.nativeElement.files[0]);

    if (this.isEdit && this.blogId) {
      this.blogService.updateBlog(this.blogId, formData).subscribe(
        (response) => {
          console.log('Cập nhật blog thành công', response);
          alert('Blog đã được cập nhật thành công!');
          this.router.navigate(['/blog']);
        },
        (error) => {
          console.error('Đã xảy ra lỗi khi cập nhật blog:', error);
          this.handleBlogError(error);
        }
      );
    } else {
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
          this.handleBlogError(error);
        }
      );
    }
  }

  private handleBlogError(error: any): void {
    if (error instanceof HttpErrorResponse) {
      console.error('Lỗi từ server:', error);
      alert('Đã xảy ra lỗi khi tạo blog: ' + (error.error.message || 'Lỗi không xác định'));
    } else {
      alert('Đã xảy ra lỗi khi tạo blog. Vui lòng thử lại!');
    }
  }
}