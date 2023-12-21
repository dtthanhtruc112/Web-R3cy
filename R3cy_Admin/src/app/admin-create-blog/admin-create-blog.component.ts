import { Component, ElementRef, OnInit, Renderer2, ViewChild, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-admin-create-blog',
  templateUrl: './admin-create-blog.component.html',
  styleUrl: './admin-create-blog.component.css'
})
export class AdminCreateBlogComponent {
  // Load ảnh
  @ViewChild('myfile') fileInput!: ElementRef;
  @ViewChild('selectedImage') selectedImage!: ElementRef;

  imageSrc: string = '';

  displayImage(event: any): void {
    const input = this.fileInput?.nativeElement as HTMLInputElement;
    const image = this.selectedImage?.nativeElement as HTMLImageElement;

    // Kiểm tra xem người dùng đã chọn file chưa
    if (input?.files && input.files[0]) {
      // Đọc và hiển thị hình ảnh mới
      const reader = new FileReader();
      reader.onload = function (e) {
        if (e?.target?.result) {
          // Đặt giá trị của thuộc tính src cho thẻ img
          image.src = e.target.result as string;
        }
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  selectImage() {
    // Đặt giá trị của input file về null để cho phép chọn ảnh mới
    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.value = null;
    }
  }

  // Hiện popup
  showOverlay: boolean = false;
  showSuccessPopup: boolean = false;

  closePopup(): void {
    console.log('Closing popup...');
    this.showOverlay = false;
    this.showSuccessPopup = false;
    this.addressPopup = false;
  }

  saveData(): void {
    // alert('Đã lưu thông tin');
    // Hiển thị overlay
    this.showOverlay = true;

    // Hiển thị popup
    this.showSuccessPopup = true;

    // Ẩn popup sau 3 giây (3000 milliseconds)
    // setTimeout(() => {
    //   this.closePopup();
    //   this.cdr.detectChanges(); // Manually trigger change detection
    // }, 3000);
  }



  // Xóa địa chỉ
  deleteDiv(element: HTMLElement): void {
    const container = element.parentNode as HTMLElement;

    if (container instanceof HTMLElement) {
      container.remove();
    }
  }

  // Thêm địa chỉ
  addressPopup: boolean = false;
  openPopup(): void {
    this.showOverlay = true;
    this.addressPopup = true;
  }

  newAddress: string = '';
  addNewAddress(): void {
    // Thêm logic để xử lý và lưu địa chỉ mới vào cơ sở dữ liệu hoặc nơi cần thiết
    console.log('Đã thêm địa chỉ mới:', this.newAddress);

    // Sau khi xử lý, bạn có thể đóng popup nếu cần
    this.closePopup();
  }

}
