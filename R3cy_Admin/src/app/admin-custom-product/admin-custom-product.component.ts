 // admin-custom-product.component.ts
import { Component, OnInit } from '@angular/core';
import { CustomProductService } from '../Service/customproduct.service';
import { CustomProduct } from '../Interface/CustomProduct';

@Component({
  selector: 'app-admin-custom-product',
  templateUrl: './admin-custom-product.component.html',
  styleUrls: ['./admin-custom-product.component.css']
})
export class AdminCustomProductComponent implements OnInit {

  data: CustomProduct[] = [];
  displayedData: CustomProduct[] = [];

  sortColumn: number | 'all' = 'all';
  customColumnNames: string[] = ['Tên', 'Email', 'SĐT', 'Sản phẩm', 'Mô tả', 'File thiết kế'];
  searchKeyword: string = '';

  constructor(private customProductService: CustomProductService) {}

  ngOnInit(): void {
    this.customProductService.getCustomProducts().subscribe(data => {
      this.data = data;
      this.updateDisplayedData();
    });
  }

  sortTable(): void {
    this.updateDisplayedData();
  }

  updateDisplayedData(): void {
    this.displayedData = this.sortColumn === 'all' ? [...this.data] : this.data.slice(0, this.sortColumn);
  }

  getFileDisplayName(file: File): string {
    return file.name;
  }

  getObjectKeys(obj: CustomProduct): string[] {
    return obj ? Object.keys(obj) as string[] : [];
  }

  getItemValue(item: CustomProduct, key: string): string | File | undefined {
    console.log(key)
    return item ? (item as any)[key] : undefined;
  }

  handleSearch(): void {
    if (this.searchKeyword) {
      this.displayedData = this.data.filter(item =>
        this.getObjectKeys(item).some(key =>
          this.getItemValue(item, key)?.toString().toLowerCase().includes(this.searchKeyword.toLowerCase())
        )
      );
    } else {
      this.updateDisplayedData();
    }
  }
}
