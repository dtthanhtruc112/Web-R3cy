import { Component, ElementRef, OnInit, Renderer2, ViewChild, AfterViewInit } from '@angular/core';
import { UsersService } from '../Service/users.service';
import { OrderService } from '../Service/order.service';
import { Product } from '../Interface/Order';

@Component({
  selector: 'app-trangtaikhoan',
  templateUrl: './trangtaikhoan.component.html',
  styleUrl: './trangtaikhoan.component.css'
})

export class TrangtaikhoanComponent implements OnInit {
  selectedbar: string = 'hoso_content';

  showContent(contentId: string): void {
    this.selectedbar = contentId;
  }

  // Chỉnh sửa hồ sơ
  chinhsua(inputId: string): void {
    const inputElement = document.getElementById(inputId) as HTMLInputElement | null;

    if (inputElement) {
      // Bỏ đi thuộc tính readonly để cho phép sửa đổi
      inputElement.removeAttribute("readonly");

      // Focus vào input để người dùng có thể bắt đầu sửa đổi ngay lập tức
      inputElement.focus();
    }
  }

  // ngOnInit() {
  // }


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
    console.log('Saving data...');
    // Hiển thị overlay
    this.showOverlay = true;

    // Hiển thị popup
    this.showSuccessPopup = true;

    // Ẩn popup sau 3 giây (3000 milliseconds)
    setTimeout(() => {
      this.closePopup();
    }, 3000);
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


  userIdToDisplay: number = 1; // Chọn ID cụ thể

  // Các biến để binding
  hovaten: string = '';
  email: string = '';
  sdt: string = '';
  tendangnhap: string = '';
  diachi: string = '';
  selectedGender: string = '';
  day: string[] = [];
  month: string[] = [];
  year: string[] = [];
  userAddresses: any[] = [];

  constructor(private _userService: UsersService,
    private _orderService: OrderService
  ) { }


  ngOnInit(): void {
    this.loadUserInfo(this.userIdToDisplay);
    this.loadOrderInfo();
  }

  loadUserInfo(userId: number): void {
    this._userService.getUserById(userId).subscribe(user => {
      if (user) {
        this.hovaten = user.hovaten;
        this.email = user.email;
        this.sdt = user.sdt;
        this.tendangnhap = user.tendangnhap;
        this.diachi = user.diachi;
        this.selectedGender = user.gioitinh;
        const [ngay, thang, nam] = user.ngaysinh.split('/');
        this.selectedDay = ngay;
        this.selectedMonth = thang;
        this.selectedYear = nam;
        this.day = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
        this.month = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
        this.year = Array.from({ length: 150 }, (_, i) => (1970 + i).toString());
        this.userAddresses = [];
        user.diachi.forEach((address: any) => {
          const diachiItem: any = {};
          diachiItem.hovaten = this.hovaten;
          diachiItem.sdt = this.sdt;
          diachiItem.diachi = address.tendiachi;

          // Thêm đối tượng địa chỉ vào mảng
          this.userAddresses.push(diachiItem);
        });
        // Các thông tin khác nếu cần
      }
    });
  }

  Orders: any[] = [];
  totalOrderValue: number = 0;

  loadOrderInfo(): void {
    this._orderService.getOrder().subscribe((orders: any[]) => {
      this.Orders = orders.map(order => ({
        ...order,
        products: (order.products as any[]).map((product: any) => ({
          ...product,
          productValue: product.quantity * product.price
        } as Product)) // Chuyển kiểu product thành Product
      }));
      this.initialOrders = [...this.Orders]; // Lưu trữ danh sách ban đầu
      this.filterOrders();
      this.totalOrderValue = this.calculateTotalOrderValue();

    });
  }

  // Tính tổng đơn hàng
  calculateTotalOrderValue(): number {
    return this.Orders.reduce((total: number, order) => {
      return total + order.products.reduce((orderTotal: number, product: Product) => {
        return orderTotal + product.productValue;
      }, 0);
    }, 0);
  }

  // Phân loại đơn
  selectedStatus: string = 'Tất cả đơn hàng';
  initialOrders: any[] = []; // Lưu trữ danh sách đơn hàng ban đầu

  resetOrders(): void {
    this.Orders = [...this.initialOrders]; // Khôi phục danh sách về trạng thái ban đầu
  }

  filterOrders(): void {
    // Lọc danh sách đơn hàng dựa trên trạng thái đã chọn
    if (this.selectedStatus !== 'Tất cả đơn hàng') {
      this.Orders = this.Orders.filter(order => order.status === this.selectedStatus);
    }
  }

  changeStatusFilter(status: string): void {
    this.selectedStatus = status;
    this.resetOrders(); // Reset danh sách mỗi khi chuyển trạng thái

    this.filterOrders();
  }


  days: number[] = Array.from({ length: 31 }, (_, i) => i + 1);
  months: number[] = Array.from({ length: 12 }, (_, i) => i + 1);
  years: number[] = Array.from({ length: 150 }, (_, i) => new Date().getFullYear() - i);

  // Giá trị được chọn
  selectedDay: number = 1;
  selectedMonth: number = 1;
  selectedYear: number = new Date().getFullYear();

}


