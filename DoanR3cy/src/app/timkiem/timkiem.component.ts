// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup } from '@angular/forms';
// import { ProductService } from '../Service/product.service';
// import { product } from '../Interface/product';

// @Component({
//   selector: 'app-timkiem',
//   templateUrl: './timkiem.component.html',
//   styleUrls: ['./timkiem.component.css']
// })
// export class TimkiemComponent implements OnInit {
//   searchForm!: FormGroup;
//   product: product[] = [];
//   allProducts: product[] = [];
//   searchResults: product[] = [];
//   searchKeyword: string = '';
//   showSearchResults: boolean = false;

//   constructor(private fb: FormBuilder, private productService: ProductService) {}

//   ngOnInit(): void {
//     this.productService.getData().subscribe((data: product[]) => {
//       this.allProducts = data;
//     });

//     this.searchForm = this.fb.group({
//       searchKeyword: ['']
//     });
//   }

//   handleSearch(): void {
//     if (this.searchForm) {
//       const keyword = this.searchForm.get('searchKeyword')?.value.toLowerCase();

//       if (keyword) {
//         // Lọc danh sách kết quả tìm kiếm
//         this.searchResults = this.allProducts.filter(item =>
//           containsKeyword(item, keyword)
//         );

//         this.showSearchResults = true;
//       } else {
//         // Hiển thị tất cả sản phẩm nếu không có từ khóa tìm kiếm
//         this.showSearchResults = false;
//       }
//     }
//   }
// }

// // Hàm hỗ trợ kiểm tra từ khóa có xuất hiện trong bất kỳ trường nào không
// function containsKeyword(item: product, keyword: string): boolean {
//   // Kiểm tra từ khóa xuất hiện trong bất kỳ trường nào
//   return Object.values(item).some(value =>
//     value && typeof value === 'string' && value.toLowerCase().includes(keyword)
//   );
// }
// timkiem.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../Service/product.service';
import { product } from '../Interface/product';

@Component({
  selector: 'app-timkiem',
  templateUrl: './timkiem.component.html',
  styleUrls: ['./timkiem.component.css']
})
export class TimkiemComponent implements OnInit {
  searchForm!: FormGroup;
  allProducts: product[] = [];
  searchResults: product[] = [];
  showSearchResults: boolean = false;

  constructor(private fb: FormBuilder, private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.productService.getData().subscribe((data: product[]) => {
      this.allProducts = data;
    });

    this.searchForm = this.fb.group({
      searchKeyword: ['']
    });
  }

  handleSearch(): void {
    if (this.searchForm) {
      const keyword = this.searchForm.get('searchKeyword')?.value.toLowerCase();

      if (keyword) {
        // Lọc danh sách kết quả tìm kiếm
        this.searchResults = this.allProducts.filter(item =>
          item.name.toLowerCase().includes(keyword)
        );

        this.showSearchResults = true;

        // Chuyển hướng đến trang kết quả tìm kiếm
        this.router.navigate(['/timkiem', { keyword: keyword }]);
      } else {
        // Hiển thị tất cả sản phẩm nếu không có từ khóa tìm kiếm
        this.showSearchResults = false;
        console.log(this.showSearchResults)
      }
    }
  }
}

