import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { OrderService } from '../Service/order.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgZone } from '@angular/core';
import { Location } from '@angular/common';



@Component({
  selector: 'app-admin-donhang',
  templateUrl: './admin-donhang.component.html',
  styleUrl: './admin-donhang.component.css'
})
export class AdminDonhangComponent implements OnInit {
  selectedbar: string = 'trang-thai-don-hang';

  showContent(contentId: string): void {
    this.selectedbar = contentId;
  }

   // Hiện popup
   showOverlay: boolean = false;
   showSuccessPopup: boolean = false;
 
   closePopup(): void {
     console.log('Closing popup...');
     this.showOverlay = false;
     this.showSuccessPopup = false;
     this.reasonPopup = false;
   }
 
   saveData(): void {
     // alert('Đã lưu thông tin');
     // Hiển thị overlay
     this.showOverlay = true;
 
     // Hiển thị popup
     this.showSuccessPopup = true;
 
     // Ẩn popup sau 3 giây (3000 milliseconds)
     setTimeout(() => {
       this.closePopup();
     }, 3000);
   }

   // lý do
  reasonPopup: boolean = false;
  openPopup(): void {
    this.showOverlay = true;
    this.reasonPopup = true;
  }

  reason: string = '';
  addReason(order: any): void {
    const userId = order ? order.userid : null; // Replace with the actual user ID
    const orderNumber = order ? order.ordernumber : null;
    // Gọi API để cập nhật rejectreason cho đơn hàng
    this._orderService.updateOrderReason(userId, orderNumber, this.reason)
      .subscribe(
        updatedOrder => {
          console.log('Đã cập nhật lý do:', this.reason);
          this.updateOrderStatus1(order)
          // Sau khi cập nhật, đóng popup nếu cần
          this.closePopup();
        },
        error => {
          console.error('Error updating reject reason:', error);
          // Xử lý lỗi nếu cần
        }
      );
  }

  constructor(
    private _orderService: OrderService, private cdr: ChangeDetectorRef, private route: ActivatedRoute, private router: Router, private zone: NgZone, private location: Location
  ) { }

  ngOnInit(): void {
    this.loadOrderInfo();
    this.route.params.subscribe(params => {
      this.selectedbar = params['id'] || 'trang-thai-don-hang'; // Set a default value if 'id' is not present
    });
  }

  Orders: any[] = [];
  totalOrderValue: number = 0;

  calculateTotalOrderValue(order: any): number {
    return order.products.reduce((orderTotal: number, product: any) => {
      return orderTotal + (product.quantity * product.price);
    }, 0);
  }
  
  // loadOrderInfo(): void {
  //   const userId = 1;

  //   this._orderService.getOrder(userId).subscribe((orders: any[]) => {
  //     this.Orders = orders.map(order => ({
  //       ...order,
  //       products: (order.products as any[]).map((product: any) => ({
  //         ...product,
  //         productValue: product.quantity * product.price
  //       })),
  //       totalOrderValue: this.calculateTotalOrderValue(order) // Calculate total value for each order
  //     }));

  //     this.initialOrders = [...this.Orders]; // Lưu trữ danh sách ban đầu
  //     this.filterOrders();

  //     // Now each order has a "totalOrderValue" property representing the total value for that order
  //     console.log('Orders with Total Order Value:', this.Orders);
  //   });
  // }

  loadOrderInfo(): void {
    this._orderService.getAllOrders().subscribe((orders: any[]) => {
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

  getFilteredOrders(orderStatuses: string[]): any[] {
    if (this.selectedbar === 'trang-thai-don-hang') {
      return this.Orders; // Display all orders
    } else if (this.selectedbar === 'chua-nhan-hang') {
      // Filter orders based on the given array of 'orderStatuses'
      return this.Orders.filter(order => orderStatuses.includes(order.order_status));
    } else if (this.selectedbar === 'da-giao') {
      // Filter orders based on the given array of 'orderStatuses'
      return this.Orders.filter(order => orderStatuses.includes(order.order_status));
    } else if (this.selectedbar === 'da-huy') {
      // Filter orders based on the given array of 'orderStatuses'
      return this.Orders.filter(order => orderStatuses.includes(order.order_status));
    } else if (this.selectedbar === 'don-hang-moi') {
      // Filter orders based on the given array of 'orderStatuses'
      return this.Orders.filter(order => orderStatuses.includes(order.order_status));
    } else if (this.selectedbar === 'hoan-tra') {
      // Filter orders based on the given array of 'orderStatuses'
      return this.Orders.filter(order => orderStatuses.includes(order.order_status));
    } 
    
    // Add more conditions as needed for other 'selectedbar' values
  
    return []; // Default to an empty array if no matching condition is found
  }

  updatePaymentStatus(order: any): void {
    // Gọi hàm cập nhật trạng thái thanh toán và cập nhật giá trị trên server

    const userId = order ? order.userid : null; // Replace with the actual user ID
    const orderNumber = order ? order.ordernumber : null;
    console.log('Order ID:', order.ordernumber);

    this._orderService.updateOrderStatus(userId, orderNumber, order.order_status, true)
    .subscribe(
      (updatedOrder) => {
        // Cập nhật giá trị paymentstatus tùy thuộc vào định dạng trả về từ server
        console.log('Order updated successfully:', updatedOrder);
        // Giả sử server trả về là một giá trị boolean
        // this.zone.run(() => {
        //   this.router.navigate(['/donhang/don-hang-moi']);
        // });
        // window.location.reload();
        this.router.navigate(['/donhang/don-hang-moi']);


      },
      error => {
        // Xử lý lỗi khi cập nhật trạng thái thanh toán
        console.error('Error updating payment status:', error);
      }
    );
  }

  updateOrderStatus(order: any): void {
    // Gọi hàm cập nhật trạng thái thanh toán và cập nhật giá trị trên server

    const userId = order ? order.userid : null;
    const orderNumber = order ? order.ordernumber : null;
    console.log('Order ID:', order.ordernumber);

    this._orderService.updateOrderStatus(userId, orderNumber, "Đang giao", order.paymentstatus)
    .subscribe(
      (updatedOrder) => {
        // Cập nhật giá trị paymentstatus tùy thuộc vào định dạng trả về từ server
        console.log('Order updated successfully:', updatedOrder);
        // Giả sử server trả về là một giá trị boolean
        
        this.router.navigate(['/donhang/chua-nhan-hang']);
        window.location.reload();
      },
      error => {
        // Xử lý lỗi khi cập nhật trạng thái thanh toán
        console.error('Error updating payment status:', error);
      }
    );
  }

  updateOrderStatus1(order: any): void {
    // Gọi hàm cập nhật trạng thái thanh toán và cập nhật giá trị trên server

    const userId = order ? order.userid : null;
    const orderNumber = order ? order.ordernumber : null;
    console.log('Order ID:', order.ordernumber);

    this._orderService.updateOrderStatus(userId, orderNumber, "Đã hủy", order.paymentstatus)
    .subscribe(
      (updatedOrder) => {
        // Cập nhật giá trị paymentstatus tùy thuộc vào định dạng trả về từ server
        console.log('Order updated successfully:', updatedOrder);
        // Giả sử server trả về là một giá trị boolean
        
        this.router.navigate(['/donhang/da-huy']);
        window.location.reload();
      },
      error => {
        // Xử lý lỗi khi cập nhật trạng thái thanh toán
        console.error('Error updating payment status:', error);
      }
    );
  }
  
  
  
 
}
