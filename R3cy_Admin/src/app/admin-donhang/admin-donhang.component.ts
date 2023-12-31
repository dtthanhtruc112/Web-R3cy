import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { OrderService } from '../Service/order.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgZone } from '@angular/core';
import { Location } from '@angular/common';
import { Order } from '../Interface/order';



@Component({
  selector: 'app-admin-donhang',
  templateUrl: './admin-donhang.component.html',
  styleUrl: './admin-donhang.component.css'
})
export class AdminDonhangComponent implements OnInit {
  selectedbar: string = 'trang-thai-don-hang';
  data: Order[] = [];
  ordersToShow: number | undefined;

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
    this.selectedOrder = null;
    this.orderdetailPopup = false;

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

  orderdetailPopup: boolean = false;

  // Hiển thị detail order
  selectedOrder: any;
  showOrderDetails(order: any): void {
    this.selectedOrder = order;
    this.showOverlay = true;
    this.orderdetailPopup = true;
  }

  showProductDetails(productId: number): void {
    // Gọi hàm hiển thị chi tiết sản phẩm từ service
    this._orderService.getOrderById(productId.toString()).subscribe((order: any) => {
      this.selectedOrder = order;
      this.showOverlay = true;
      this.orderdetailPopup = true;
    });
  }



  constructor(
    private _orderService: OrderService, private cdr: ChangeDetectorRef, private route: ActivatedRoute, private router: Router, private zone: NgZone, private location: Location
  ) { }

  ngOnInit(): void {
    this.loadOrderInfo();
    
    this.route.params.subscribe(params => {
      this.selectedbar = params['id'] || 'trang-thai-don-hang'; // Set a default value if 'id' is not present
    });

    this._orderService.getAllOrders().subscribe(data => {
      this.data = data;
      this.updateDisplayedData();
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
    if (this.searchOrderNumber) {
      this.filteredOrders = this.Orders.filter(order =>
        order.ordernumber.includes(this.searchOrderNumber)
      );
    } else {
      this.filteredOrders = this.Orders;
    }
  }

  filteredOrders: Order[] = [];
  searchOrderNumber: string = '';
  orderNumberInput: string = '';

  getOrderDetails() {
    if (this.orderNumberInput) {
      this._orderService.getOrderById(this.orderNumberInput).subscribe(
        (order) => {
          console.log('Order:', order);
        },
        (error) => {
          console.error('Error fetching order:', error);
        }
      );
    } else {
      console.warn('Please enter an order number.');
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
          // Display a success alert
        window.alert('Cập nhật trạng thái thanh toán thành công');
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
          // Display a success alert
        window.alert('Cập nhật trạng thái đơn hàng thành công');
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
           // Display a success alert
          window.alert('Cập nhật trạng thái đơn hàng thành công');

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

  sortBy: string | null = null;
  sortOrder: 'asc' | 'desc' = 'asc';



  // Function to parse the date string in the format dd/mm/yyyy to a Date object
  parseDate(dateString: string): Date {
    const parts = dateString.split('/');
    // Month is 0-based, so subtract 1
    const year = parseInt(parts[2], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[0], 10);
    return new Date(year, month, day);
  }

  // Modify your sortTable method to use the parseDate function
  sortTable(column: string) {
    if (this.sortBy === column) {
      // If clicking on the same column, reverse the order
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      // If clicking on a different column, set the new column and order to ascending
      this.sortBy = column;
      this.sortOrder = 'asc';
    }

    // Sort the Orders array based on the selected column and order
    this.Orders.sort((a, b) => {
      const aValue = column === 'ordereddate' ? a.ordereddate : a[column];
      const bValue = column === 'ordereddate' ? b.ordereddate : b[column];

      if (aValue > bValue) {
        return this.sortOrder === 'asc' ? 1 : -1;
      } else if (aValue < bValue) {
        return this.sortOrder === 'asc' ? -1 : 1;
      } else {
        return 0;
      }
    });
}


  

  // Lọc
  @ViewChild('orderNumberInputField') orderNumberInputField: ElementRef | undefined;

  sortColumn: number | 'all' = 'all';
// Other properties...

sortTable1(): void {
  this.updateDisplayedData();
}

updateDisplayedData(): void {
  this.filteredOrders = this.sortColumn === 'all' ? [...this.data] : this.data.slice(0, this.sortColumn);
}

  // getObjectKeys(obj: Order): string[] {
  //   return obj ? Object.keys(obj) as string[] : [];
  // }

  // getItemValue(item: Order, key: string): string | File | undefined {
  //   return item && item.hasOwnProperty(key) ? (item as any)[key] : undefined;
  // }
   
  handleSearch(event: any): void {
    event.preventDefault();
  
    if (this.searchOrderNumber) {
      this._orderService.getOrderById(this.searchOrderNumber).subscribe(
        (order) => {
          console.log('Order:', order);
          // Handle the retrieved order details as needed
          this.showOrderDetails(order);

           // Tính toán lại tổng giá trị của đơn hàng
      order.totalOrderValue = this.calculateTotalOrderValue(order);
  
          // Update filteredOrders to display only the searched order
          this.filteredOrders = [order];
        },
        (error) => {
          window.alert('Không tìm thấy đơn hàng. Vui lòng nhập lại!')
          console.error('Error fetching order:', error);
          // Handle the error, e.g., show an error message to the user
        }
      );
    } else {
      // If searchOrderNumber is empty, reset to display all orders
      this.filteredOrders = [...this.Orders];
    }
  }
}
