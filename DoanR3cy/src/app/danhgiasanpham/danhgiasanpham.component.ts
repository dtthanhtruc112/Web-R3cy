import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order, Product } from '../Interface/Order';
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

  feedbackText: string = '';
  saveFeedback() {
    // Check if there is an order and at least one product
    if (this.order && this.order.products.length > 0) {
      const firstProduct = this.order.products[0]; // Assuming you want to update feedback for the first product

      // Assuming user id is 1
      const userId = 1;

      // Assuming the feedback text is stored in the feedbackText property
      const feedback = this.feedbackText;

      this.orderService.updateProductFeedback(userId, this.order.ordernumber, firstProduct.id, feedback).subscribe(
        (updatedProduct: Product) => {
          console.log('Product feedback updated successfully:', updatedProduct);
          this.feedbackText = '';
          window.alert('Thông tin đã được gửi thành công. Cảm ơn quý khách!');
          // Optionally, you can perform additional actions after successful feedback submission
        },
        (error) => {
          console.error('Error updating product feedback:', error);
        }
      );
    }
  }
}
