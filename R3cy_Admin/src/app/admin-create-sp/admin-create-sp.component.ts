import { Component } from '@angular/core';
import { ProductService } from '../Service/product.service';

@Component({
  selector: 'app-admin-create-sp',
  templateUrl: './admin-create-sp.component.html',
  styleUrl: './admin-create-sp.component.css'
})
export class AdminCreateSpComponent {
    productt: any = {
      // Các thuộc tính đã nhập từ giao diện HTML
      name: '',
      price: 0,
      oldprice: 0,
      category1: '',
      category2:'',
      opt1:'',
      opt2:'',
      description:'',
      quantity: 0,
      rate: 5,
      img1:'',
      img2:'',
      img3:'',
      avt1:'',
      accountfb1: "Trân Phạm",
      fb1:"Sản phẩm có chất lượng tốt, giá cả hợp lí",
      accountask1:"Thi Thanh",
      ask1: "Thời gian giao hàng có lâu không?" ,
      accountanswer1:"Phan Hoàng",
      answer1:"Khoảng 3~7 ngày, tương đối nhanh.",
      accountask2:"Phúc Trần",
      ask2: "Sản phẩm này dùng có bền không?",
      accountanswer2:"Trần Thanh",
      answer2: "Tôi đã mua sản phẩm này được 2 tháng, đến hiện tại dùng vẫn ổn.",
      sold_quantity: 0,
      input_answer:"",
      input_ask:"",
      input_name:"",
      id: 16
    };

  constructor(private productService: ProductService) {}

  saveProduct(): void {
    // Gọi service để thêm sản phẩm mới
    this.productService.addProduct(this.productt).subscribe(
      response => {
        console.log('Product saved successfully:', response);
        // Thực hiện các hành động khác sau khi lưu thành công (nếu cần).
      },
      error => {
        console.error('Error saving product:', error);
        // Xử lý lỗi nếu cần thiết.
      }
    );
    alert("Thêm sản phẩm thành công!")
  }
}
