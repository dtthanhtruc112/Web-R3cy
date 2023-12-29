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




@Component({
  selector: 'app-trangtaikhoan',
  templateUrl: './trangtaikhoan.component.html',
  styleUrl: './trangtaikhoan.component.css'
})

export class TrangtaikhoanComponent implements OnInit {
  selectedbar: string = 'hoso_content';
  order: any;

  showContent(contentId: string): void {
    this.selectedbar = contentId;
  }

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

  discountCode: string = ''; // Property to bind to the input field
  discounts: any[] = []; // Property to store the fetched discount information

  isUsed: boolean = false;


  saveData(): void {
    // alert('Đã lưu thông tin');
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
          const userids = discount.userids;

          // Log userid for debugging
          console.log('userid:', userids);
    
          // Add the new discount to the array
          this.discounts.push(discount);
    
          // Save the updated discounts array to sessionStorage
          sessionStorage.setItem('discounts', JSON.stringify(this.discounts));
    
          if (this.isUserEligible(userids)) {
            // Người dùng đủ điều kiện, đánh dấu là đã sử dụng
            this.isUsed = true;
            console.log('Người dùng đủ điều kiện, đã sử dụng:', this.isUsed);
          } else {
            console.log('Người dùng không đủ điều kiện, chưa sử dụng:', this.isUsed);
          }
        });

        // const userids = data.userids;
        // // Add the new discount to the array
        // this.discounts.push(data);

        // // Save the updated discounts array to session storage
        // sessionStorage.setItem('discounts', JSON.stringify(this.discounts));

        // // Handle data or update your component as needed

        // if (this.isUserEligible(userids)) {
        //   // Người dùng đủ điều kiện, đánh dấu là đã sử dụng
        //   this.isUsed = true;
        // }
      },
      (error) => {
        console.error('Error fetching discount:', error);
        // Handle error as needed
      }
    );
  }

  // Xem voucher đã được sử dụng hay chưa
  isUserEligible(userids: any[]): boolean {
    // Lấy userId của người dùng hiện tại từ AuthService
    const userid = this.authService.getUserId();
  
    if (userid !== null) {
      const userId = parseInt(userid, 10);
  
      console.log('userId:', userId);
      console.log('userids:', userids);
  
      // Sử dụng phương thức some để kiểm tra xem userId có trong danh sách userids hay không
      // some sẽ trả về true nếu ít nhất một phần tử trong mảng thỏa mãn điều kiện
      return userids.some(id => id.userid === userId);
    }
  
    // Nếu userid là null hoặc không thể chuyển đổi thành số, trả về giá trị mặc định (ví dụ: false)
    return false;
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
    private _orderService: OrderService, private cdr: ChangeDetectorRef, private route: ActivatedRoute, private router: Router, private authService: AuthService, private discountService: DiscountService
  ) { }




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

  // Orders: Order[] = [];
  // totalOrderValue: number = 0;
  // selectedStatus: string = 'Tất cả đơn hàng';
  // initialOrders: Order[] = [];

  // loadOrderInfo(): void {
  //   this._orderService.getOrderByUserId(1).subscribe((userOrders: Order[] | undefined) => {
  //     if (userOrders) {
  //       this.Orders = userOrders.map(order => {
  //         const mappedOrder: Order = {
  //           ...order,
  //           products: order.products.map(product => {
  //             const productValue = product.quantity * product.price;
  //             return {
  //               ...product,
  //               productValue: productValue
  //             };
  //           }),
  //           totalOrderValue: 0 // Initialize totalOrderValue to 0
  //         };
  //         mappedOrder.totalOrderValue = this.calculateTotalOrderValue(mappedOrder); // Calculate totalOrderValue
  //         console.log(`Order ${order.ordernumber}: Total Order Value=${mappedOrder.totalOrderValue}`);
  //         return mappedOrder;
  //       });

  //       this.initialOrders = [...this.Orders];
  //       this.filterOrders();

  //       // Log total order value for each order
  //       this.Orders.forEach(order => {
  //         console.log(`Order Number ${order.ordernumber}: Total Order Value = ${order.totalOrderValue}`);
  //       });
  //     }
  //   });
  // }

  // calculateTotalOrderValue(order: Order): number {
  //   return order.products.reduce((orderTotal: number, product: Product) => {
  //     return orderTotal + (product.productValue || 0);
  //   }, 0);
  // }



  // resetOrders(): void {
  //   this.Orders = [...this.initialOrders];
  // }

  // filterOrders(): void {
  //   if (this.selectedStatus !== 'Tất cả đơn hàng') {
  //     this.Orders = this.Orders.filter(order => order.status === this.selectedStatus);
  //   }
  // }

  // changeStatusFilter(status: string): void {
  //   this.selectedStatus = status;
  //   this.resetOrders();
  //   this.filterOrders();
  // }

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
