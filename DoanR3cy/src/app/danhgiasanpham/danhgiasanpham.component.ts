import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order } from '../Interface/Order';
import { OrderService } from '../Service/order.service';

@Component({
  selector: 'app-danhgiasanpham',
  templateUrl: './danhgiasanpham.component.html',
  styleUrls: ['./danhgiasanpham.component.css']
})
export class DanhgiasanphamComponent  {
  order: Order | undefined;

  constructor(private route: ActivatedRoute, private orderService: OrderService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const orderId = params.get('id');
      console.log(orderId);

      if (orderId) {
        const orderIdNumber = +orderId;

        // Assuming user id is 1
        const userId = 1;

        // Pass the user ID to getOrder method
        this.orderService.getOrder(userId).subscribe(
          (orders: Order[]) => {
            // Find the order with the specified ID
            const foundOrder = orders.find(order => order.ordernumber === orderIdNumber);

            if (foundOrder) {
              this.order = foundOrder;
            } else {
              console.error(`Order with ID ${orderIdNumber} not found.`);
            }
          },
          (error) => {
            console.error(`Error fetching orders for user with ID ${userId}: ${error}`);
          }
        );
      }
    });
  }
}
