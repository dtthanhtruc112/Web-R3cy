import { Component } from '@angular/core';
import { OrderService } from '../Service/order.service';

@Component({
  selector: 'app-admin-tongquan',
  templateUrl: './admin-tongquan.component.html',
  styleUrl: './admin-tongquan.component.css'
})
export class AdminTongquanComponent {
  newOrdersCount: number = 0;
  pendingOrdersCount: number = 0;
  completedOrdersCount: number = 0;
  cancelledOrdersCount: number = 0;

  dateRange: string = 'all';
  channel: string = 'Website';
  data: any = {};

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.loadOrderCounts();
    this.fetchDataAndUpdateUI();
  }

  loadOrderCounts(): void {
    // Gọi service để lấy thông tin và tính toán số đơn hàng cho mỗi trạng thái
    this.orderService.getAllOrders().subscribe((orders: any[]) => {
      this.newOrdersCount = orders.filter(order => order.order_status === 'Chờ xử lí').length;
      this.pendingOrdersCount = orders.filter(order => order.order_status === 'Đang giao').length;
      this.completedOrdersCount = orders.filter(order => order.order_status === 'Đã giao').length;
      this.cancelledOrdersCount = orders.filter(order => order.order_status === 'Đã hủy').length;
    });
  }
  onDateRangeChange(): void {
    this.fetchDataAndUpdateUI();
  }
  onChannelChange(): void {
    this.fetchDataAndUpdateUI();
  }
  fetchDataAndUpdateUI(): void {
    this.orderService
        .fetchData(this.dateRange, this.channel)
        .subscribe(
            (data) => {
                console.log('Dữ liệu từ API:', data);
                this.data = data;
            },
            (error) => {
                console.error('Lỗi khi gửi yêu cầu đến API:', error);
                // Hiển thị thông báo lỗi
            }
        );
}

}
