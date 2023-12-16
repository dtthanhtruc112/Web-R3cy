import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order } from '../Interface/Order';
import { OrderService } from '../Service/order.service';

@Component({
  selector: 'app-danhgiasanpham',
  templateUrl: './danhgiasanpham.component.html',
  styleUrls: ['./danhgiasanpham.component.css']
})
export class DanhgiasanphamComponent implements OnInit {
  order: Order | undefined;

  constructor(private route: ActivatedRoute, private orderService: OrderService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const orderId = params.get('id');
      console.log(orderId)

      if (orderId) {
        const orderIdNumber = +orderId;
        this.orderService.getOrderById(orderIdNumber).subscribe(order => {
          if (order) {
            this.order = order;
          } else {
            console.error(`Order with ID ${orderIdNumber} not found.`);
          }
        });
      }
    });
  }
}
