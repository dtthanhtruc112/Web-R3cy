import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order, Product } from '../Interface/Order';
import { OrderService } from '../Service/order.service';
import { AuthService } from '../Service/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-danhgiasanpham',
  templateUrl: './danhgiasanpham.component.html',
  styleUrls: ['./danhgiasanpham.component.css']
})
export class DanhgiasanphamComponent {
  order: Order | undefined;


  constructor(private route: ActivatedRoute, private orderService: OrderService, private authService: AuthService, private _http:HttpClient) { }

  
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const orderId = params.get('id');
      console.log(orderId);

      if (orderId) {
        const orderIdNumber = +orderId;
        const userid = this.authService.getUserId();

        console.log('Original userid:', userid);

        if (userid !== null) {
          const userId = parseInt(userid, 10);

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
      }
    });
  }

  feedbackText: string = '';
  feedbacks: { [productId: number]: string } = {}; 

  saveFeedback(productId: number) {
    if (this.order) {
      const userid = this.authService.getUserId();
  
      if (userid !== null) {
        const userId = parseInt(userid, 10);
        const orderNumber = this.order!.ordernumber;
        const feedback = this.feedbacks[productId] || '';
  
        // Check if feedback is defined before updating
        if (feedback !== undefined) {
          this.orderService.updateProductFeedback(userId, orderNumber, productId, feedback).subscribe(
            (updatedProduct: Product) => {
              console.log(`Product feedback for ${updatedProduct.name} updated successfully:`, updatedProduct);
              // Optionally, you can perform additional actions after successful feedback submission for each product
              window.alert('Thông tin đã được gửi thành công. Cảm ơn quý khách!');
  
              // Reset feedbackText for the corresponding product ID
              this.feedbacks[productId] = '';
            },
            (error) => {
              console.error(`Error updating product feedback for product ID ${productId}:`, error);
            }
          );
        }
      }
    }
  }

  

}
