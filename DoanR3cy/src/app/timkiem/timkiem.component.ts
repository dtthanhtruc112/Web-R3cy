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
      // Tạo mảng chứa tất cả kết quả từng từ
      const allResults: product[][] = [];

      // Lặp qua từng từ và thực hiện tìm kiếm
      keywords.forEach(keyword => {
        const resultsForKeyword = this.allProducts
          .filter(item => this.containsKeyword(item, keyword))
          .map(item => ({ ...item, highlight: true }));
        
        allResults.push(resultsForKeyword);
      });

      // Gộp tất cả các kết quả vào mảng searchResults và loại bỏ sản phẩm trùng lặp theo id
      this.searchResults = ([] as product[]).concat(...allResults).reduce<product[]>((uniqueResults, item) => {
        const existingItem = uniqueResults.find(u => u.id === item.id);
        if (!existingItem) {
          uniqueResults.push(item);
        }
        return uniqueResults;
      }, []);

      // Hiển thị kết quả tìm kiếm
      this.showSearchResults = true;
    } else {
      // Hiển thị toàn bộ danh sách sản phẩm
      this.searchResults = [...this.product];
      this.showSearchResults = false;
    }
  }

  containsKeyword(item: product, keyword: string): boolean {
    const searchableFields = ['category1', 'category2', 'name', 'description'];
  
    return searchableFields.some(field => {
      const fieldValue = (item as any)[field];
  
      if (typeof fieldValue === 'string') {
        return fieldValue.toLowerCase().includes(keyword);
      }
  
      return false;
    });
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
  
