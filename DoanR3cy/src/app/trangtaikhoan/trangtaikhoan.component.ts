import { Component, ElementRef, OnInit, Renderer2, ViewChild, AfterViewInit } from '@angular/core';
import { UsersService } from '../Service/users.service';
import { OrderService } from '../Service/order.service';
import { Order, Product } from '../Interface/Order';
import { ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../Service/auth.service';
import { DiscountService } from '../Service/discount.service';
import { Discount } from '../Interface/Discount';
import { AccountCustomer } from '../Interface/AccountCustomer';
import { AccountcustomerService } from '../Service/accountcustomer.service';



@Component({
  selector: 'app-trangtaikhoan',
  templateUrl: './trangtaikhoan.component.html',
  styleUrl: './trangtaikhoan.component.css'
})

export class TrangtaikhoanComponent implements OnInit {
  selectedbar: string = 'hoso_content';
  order: any;
  newAddress: any = { province: '', district: '', addressDetail: '' };
  isLoggedIn = false;
  currentUser: any;
  [x: string]: any;

  showContent(contentId: string): void {
    this.selectedbar = contentId;
  }

  constructor(private _userService: UsersService,
    private _orderService: OrderService, 
    private cdr: ChangeDetectorRef, 
    private route: ActivatedRoute, 
    private router: Router, 
    private authService: AuthService, 
    private discountService: DiscountService,
    private accountService: AccountcustomerService,
  ) { this.isLoggedIn = this.authService.isLoggedIn();
    this.currentUser = this.authService.getCurrentUser();}

  Name:any
  ngOnInit(): void {
    this.loadUserInfo(this.userIdToDisplay);
    this.loadOrderInfo();
    this.route.params.subscribe(params => {
      this.selectedbar = params['id'] || 'hoso_content'; // Set a default value if 'id' is not present
    });

    // Lưu trữ discount
    const storedDiscounts = sessionStorage.getItem('discounts');
    if (storedDiscounts) {
      this.discounts = JSON.parse(storedDiscounts);
    }

    // Retrieve displayed vouchers from sessionStorage
    const displayedVouchers = sessionStorage.getItem('displayedVouchers');
    if (displayedVouchers) {
      const displayedVouchersArray = displayedVouchers.split(',');
      this.displayedVouchers = new Set(displayedVouchersArray);
      console.log('Displayed vouchers from sessionStorage:', this.displayedVouchers);
    }

    // Retrieve usedStatus from sessionStorage
    const usedStatus = sessionStorage.getItem('usedStatus');
    if (usedStatus) {
      this.usedStatus = JSON.parse(usedStatus);
      console.log('Used status from sessionStorage:', this.usedStatus);
    }

    // Chỉnh sửa thông tin tài khoản (NEW)
    // Lấy _id từ Session Storage
    const currentUserString = sessionStorage.getItem('CurrentUser') || '';
    const currentUserObject = JSON.parse(currentUserString);
    const accountId = currentUserObject._id;
    // Gọi hàm getAccountInfo từ service để lấy thông tin tài khoản
    this.accountService.getAccountInfo(accountId).subscribe(
      (result) => {
        // Nếu có thông tin, cập nhật account
        if (result) {
          this.account = result;
        }
      },
      (error) => {
        console.error(error);
        // Xử lý lỗi nếu cần thiết
      }
    );
    const user = JSON.parse(sessionStorage.getItem('CurrentUser')!);
      if (user) {
        this.Name = user.Name;
      }
  }

  logOut() {
    const confirmed = confirm('Bạn có muốn đăng xuất không?');
    if(confirmed) {
      sessionStorage.removeItem('CurrentUser');
      sessionStorage.removeItem('userid');
      this.router.navigate(['/main-page']);
      // window.location.reload();
    }

  }

  // Chỉnh sửa thông tin tài khoản (NEW)
  account: AccountCustomer = new AccountCustomer();
  editedAccount: AccountCustomer = new AccountCustomer();
  isEditing: boolean = false;

  editProfile(): void {
    this.isEditing = true;
    // Copy current values to editedAccount for editing
    this.editedAccount = { ...this.account };
  }

  saveProfile(): void {
    // Save editedAccount to the database (you need to implement this)
    this.accountService.updateAccountInfo(this.account._id, this.editedAccount).subscribe(
      (result) => {
        // Update account with the edited values
        this.account = result;
        // Reset editing state
        this.isEditing = false;
        alert('Cập nhật thông tin tài khoản thành công!')
      },
      (error) => {
        console.error(error);
        // Xử lý lỗi nếu cần thiết
      }
    );

    // Update account with the edited values
    this.account = { ...this.editedAccount };

    // Reset editing state
    this.isEditing = false;
  }

  cancelEdit(): void {
    // Reset editing state without saving
    this.isEditing = false;
  }

  // Chỉnh sửa địa chỉ (NEW)
  editAddress(index: number): void {
    // Chuyển sang chế độ chỉnh sửa
    this.account.addresses[index].editMode = true;
  }

  saveAddress(index: number): void {
    // Lưu dữ liệu xuống database
    this.accountService.editAddress(this.account._id, index, this.account.addresses[index]).subscribe(
      (result) => {
        // Update account with the edited values
        this.account = result;
        // Reset editing state
        this.account.addresses[index].editMode = false;
      },
      (error) => {
        console.error(error);
        // Xử lý lỗi nếu cần thiết
      }
    );
  }

  cancelEditAddress(index: number): void {
    // Huỷ chỉnh sửa, quay lại chế độ xem thông tin
    this.account.addresses[index].editMode = false;
    // Gọi hàm getAccountInfo từ service để lấy thông tin tài khoản
    const currentUserString = sessionStorage.getItem('CurrentUser') || '';
    const currentUserObject = JSON.parse(currentUserString);
    const accountId = currentUserObject._id;
    this.accountService.getAccountInfo(accountId).subscribe(
      (result) => {
        if (result) {
          this.account = result;
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

  deleteAddress(index: number): void {
    // Xoá địa chỉ khỏi database
    this.accountService.deleteAddress(this.account._id, index).subscribe(
      (result) => {
        // Xoá địa chỉ khỏi danh sách
        this.account.addresses.splice(index, 1);
      },
      (error) => {
        console.error(error);
        // Xử lý lỗi nếu cần thiết
      }
    );
  }

  setDefaultAddress(index: number): void {
    // Đặt địa chỉ làm mặc định và cập nhật trạng thái của các địa chỉ khác
    this.accountService.setDefaultAddress(this.account._id, index).subscribe(
      (result) => {
        // Update account with the default address
        this.account = result;
      },
      (error) => {
        console.error(error);
        // Xử lý lỗi nếu cần thiết
      }
    );
    // Đặt làm mặc định và cập nhật trạng thái của các địa chỉ khác
    // this.account.addresses.forEach((address, i) => {
    //   if (i === index) {
    //     address.isDefault = true;
    //   } else {
    //     address.isDefault = false;
    //   }
    // });
  }

  addNewAddress(): void {
    const currentUserString = sessionStorage.getItem('CurrentUser') || '';
    const currentUserObject = JSON.parse(currentUserString);
    const accountId = currentUserObject._id;
    const { province, district, addressDetail } = this.newAddress;

    this.accountService.addAddress(accountId, province, district, addressDetail)
      .subscribe(
        (result) => {
          this.account = result;
          alert('Thêm địa chỉ thành công!');
          // Đóng popup sau khi thêm địa chỉ mới
          this.closePopup();
        },
        (error) => {
          console.error(error);
          // Xử lý lỗi nếu cần thiết
        }
      );
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
  showCancelPopup: boolean = false;

  closePopup(): void {
    console.log('Closing popup...');
    this.showOverlay = false;
    this.showSuccessPopup = false;
    this.addressPopup = false;
    this.showCancelPopup = false
  }

  discountCode: string = '';
  discounts: any[] = [];
  displayedVouchers: Set<string> = new Set<string>();

  // Track used status for each discount code
  usedStatus: { [key: string]: boolean } = {};

  saveData(): void {
    // Hiển thị overlay
    this.showOverlay = true;

    // Hiển thị popup
    this.showSuccessPopup = true;

    // Ẩn popup sau 3 giây (3000 milliseconds)
    setTimeout(() => {
      this.closePopup();
      this.cdr.detectChanges(); // Manually trigger change detection
    }, 3000);

    this.discountService.getDiscountByCode(this.discountCode).subscribe(
      (data: Discount | Discount[]) => {
        const discountsArray = Array.isArray(data) ? data : [data];

        discountsArray.forEach((discount) => {
          const discountCode: string = (discount.code as string);

          if (!this.displayedVouchers.has(discountCode)) {
            this.displayedVouchers.add(discountCode);

            // Mark the voucher as displayed in sessionStorage
            const displayedVouchers = sessionStorage.getItem('displayedVouchers') || '';
            sessionStorage.setItem('displayedVouchers', `${displayedVouchers},${discountCode}`);

            // Load used status from sessionStorage
            const usedStatus = sessionStorage.getItem('usedStatus') || '{}';
            this.usedStatus = JSON.parse(usedStatus);

            this.discounts.push(discount);
            sessionStorage.setItem('discounts', JSON.stringify(this.discounts));

            if (this.isUserEligible(discount.userids)) {
              if (!this.usedStatus[discountCode]) {
                this.usedStatus[discountCode] = true;

                // Save used status in sessionStorage
                sessionStorage.setItem('usedStatus', JSON.stringify(this.usedStatus));

                console.log('Người dùng đủ điều kiện, đã sử dụng:', this.usedStatus);
              }
            } else {
              console.log('Người dùng không đủ điều kiện, chưa sử dụng:', this.usedStatus);
            }
          }
        });
      },
      (error) => {
        console.error('Error fetching discount:', error);
        // Handle error as needed
      }
    );
  }

  isUserEligible(userids: any[]): boolean {
    const userid = this.authService.getUserId();

    if (userid !== null) {
      const userId = parseInt(userid, 10);
      return userids.some(id => id.userid === userId);
    }

    return false;
  }

  // Function to check if a discount is used
  isUsed(discountCode: string): boolean {
    return this.usedStatus[discountCode] || false;
  }

  // Tính số ngày còn lại:
  calculateDaysDifference(expiredDate: string): number {
    const parts = expiredDate.split('/');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);

    const expiredDateObj = new Date(year, month, day);
    const currentDate = new Date();

    const timeDiff = expiredDateObj.getTime() - currentDate.getTime();
    const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    return dayDiff;
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

  openCancelPopup(): void {
    this.showOverlay = true;
    this.showCancelPopup = true;
  }


  confirmCancel(order: any) {
    const userid = this.authService.getUserId();
    if (userid !== null) {
      const userId = parseInt(userid, 10);
      const orderNumber = order ? order.ordernumber : null;
      console.log('Order ID:', order.ordernumber);

      if (orderNumber) {
        this._orderService.updateOrderStatus(userId, orderNumber, 'Đã hủy')
          .subscribe(
            (updatedOrder) => {
              // Handle when the order has been successfully updated
              console.log('Order updated successfully:', updatedOrder);
              this.router.navigate(['/trangtaikhoan/donhang_content']);
              window.location.reload();
              // Navigate to the same route to reload the component

            },
            (error) => {
              console.error('Error updating order:', error);
              // Handle errors (display a message, etc.)
            }
          );
      }
    }

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

  calculateTotalOrderValue(order: any): number {
    return order.products.reduce((orderTotal: number, product: any) => {
      return orderTotal + (product.quantity * product.price);
    }, 0);
  }

  loadOrderInfo(): void {
    const userid = this.authService.getUserId();

    console.log('Original userid:', userid);

    if (userid !== null) {
      const userId = parseInt(userid, 10);
      this._orderService.getOrder(userId).subscribe((orders: any[]) => {
        this.Orders = orders.map(order => ({
          ...order,
          products: (order.products as any[]).map((product: any) => ({
            ...product,
            productValue: product.quantity * product.price
          })),
          totalOrderValue: this.calculateTotalOrderValue(order) // Calculate total value for each order
        }));

        this.initialOrders = [...this.Orders]; // Lưu trữ danh sách ban đầu
        this.filterOrders();

        // Now each order has a "totalOrderValue" property representing the total value for that order
        console.log('Orders with Total Order Value:', this.Orders);
      });
    } else {
      console.error('User ID is null. Cannot load orders.');
    }


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
      this.Orders = this.Orders.filter(order => order.order_status === this.selectedStatus);
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

  filteredOrders(): Order[] {
    this.resetOrders();
    const filtered = this.Orders.filter(order => this.isEligibleForReview(order));
    return [...filtered]; // Return a new array to avoid modifying the original
  }

  isEligibleForReview(order: Order): boolean {
    // Check if order status is 'Đã giao' and every product in the order has 'danhgia' as ''
    return order.order_status === 'Đã giao' && order.products.every(product => product.feedback === '');
  }

  extractOrderIds(): void {
    const filteredOrders = this.filteredOrders();

    // Log giá trị của ordernumber
    filteredOrders.forEach(order => {
      console.log('Order ID:', order.ordernumber);
      return order.ordernumber
    });

  }



}
