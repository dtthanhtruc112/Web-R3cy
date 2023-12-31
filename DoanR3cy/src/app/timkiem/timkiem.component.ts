import { Component, OnInit,ChangeDetectorRef,  NgZone   } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProductService } from '../Service/product.service';
import { product } from '../Interface/product';

@Component({
  selector: 'app-timkiem',
  templateUrl: './timkiem.component.html',
  styleUrls: ['./timkiem.component.css']
})
export class TimkiemComponent implements OnInit {
  searchForm!: FormGroup;
  product: product[] = [];
  allProducts: product[] = [];
  searchResults: product[] = [];
  searchKeyword: string = '';
  showSearchResults: boolean = false;
  // keyword: string = '';

  constructor(private fb: FormBuilder, private productService: ProductService,  private cdr: ChangeDetectorRef, private zone: NgZone) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      searchKeyword: ['']
    });

    this.productService.getData().subscribe((data: product[]) => {
      this.allProducts = data;
      this.product = data; // Hiển thị tất cả sản phẩm khi trang được load
    });
  }
  handleSearch(): void {
    const rawKeywords = this.searchForm.value.searchKeyword.toLowerCase();
    const keywords: string[] = rawKeywords.split(' ').filter((keyword: string) => keyword.trim() !== '');

  
    if (keywords.length > 0) {
      // Lọc danh sách kết quả tìm kiếm
      this.searchResults = this.allProducts
        .filter(item => this.containsAllKeywords(item, keywords))
        .map(item => ({ ...item, highlight: true })); // Thêm thuộc tính highlight cho sản phẩm tìm thấy
      console.log(' this.searchResults', this.searchResults);
  
      // Hiển thị kết quả tìm kiếm
      this.showSearchResults = true;
    } else {
      // Hiển thị toàn bộ danh sách sản phẩm
      this.searchResults = [...this.product];
      this.showSearchResults = false;
    }
  }
  
  containsAllKeywords(item: product, keywords: string[]): boolean {
    // Kiểm tra xem tất cả các từ khóa xuất hiện trong bất kỳ trường nào của sản phẩm
    return keywords.every(keyword =>
      Object.values(item).some(
        value =>
          value &&
          typeof value === 'string' &&
          value.toLowerCase().includes(keyword)
      )
    );
  }
  
  // handleSearch(): void {
  //   const keyword = this.searchForm.value.searchKeyword.toLowerCase();
  //   console.log('keywword', keyword);

  //   if (keyword) {
  //     // Lọc danh sách kết quả tìm kiếm
  //     this.searchResults = this.allProducts
  //       .filter(item => this.containsKeyword(item, keyword))
  //       .map(item => ({ ...item, highlight: true })); // Thêm thuộc tính highlight cho sản phẩm tìm thấy
  //     console.log(' this.searchResults', this.searchResults);

  //     // Hiển thị kết quả tìm kiếm
  //     this.showSearchResults = true;
  //   } else {
  //     // Hiển thị tất cả sản phẩm nếu không có từ khóa tìm kiếm
  //     this.searchResults = [...this.product];
  //     this.showSearchResults = false;
     
  //   }
  // }

  // containsKeyword(item: product, keyword: string): boolean {
  //   // Kiểm tra từ khóa xuất hiện trong bất kỳ trường nào của sản phẩm
  //   return Object.values(item).some(
  //     value =>
  //       value &&
  //       typeof value === 'string' &&
  //       value.toLowerCase().includes(keyword)
  //   );
  // }
}
  
