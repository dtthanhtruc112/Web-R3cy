import { Component } from '@angular/core';

interface DataItem {
  textName: string;
  textEmail: string;
  textPhone: string;
  textPname: string;
  textPdes: string;
  fileInput: File;
}

@Component({
  selector: 'app-admin-custom-product',
  templateUrl: './admin-custom-product.component.html',
  styleUrls: ['./admin-custom-product.component.css']
})
export class AdminCustomProductComponent {

  sortColumn: number | 'all' = 'all'; // Set a special value to indicate displaying all rows
  data: DataItem[] = [
    { textName: 'Data 1', textEmail: 'data1@example.com', textPhone: '123456789', textPname: 'Product 1', textPdes: 'Description 1', fileInput: new File([], 'Design 1.pdf') },
    { textName: 'Data 2', textEmail: 'data2@example.com', textPhone: '987654321', textPname: 'Product 2', textPdes: 'Description 2', fileInput: new File([], 'Design 2.pdf') }
    // Add other data rows
  ];

  displayedData: DataItem[] = []; // Array to store the displayed data

  // Define custom column names
  customColumnNames: string[] = ['Tên', 'Email', 'SĐT', 'Sản phẩm', 'Mô tả', 'File thiết kế'];

  searchKeyword: string = ''; // Variable to store search keyword

  constructor() {
    this.updateDisplayedData();
  }

  sortTable(): void {
    this.updateDisplayedData();
  }

  updateDisplayedData(): void {
    // Change to default display all data
    this.displayedData = this.sortColumn === 'all' ? [...this.data] : this.data.slice(0, this.sortColumn);

    // // Then, retain only the specified number of rows based on sortColumn
    // if (this.sortColumn < this.displayedData.length) {
    //   this.displayedData = this.displayedData.slice(0, this.sortColumn);
    // }
  }

  getFileDisplayName(file: File): string {
    return file.name;
  }

  getObjectKeys(obj: DataItem): string[] {
    return obj ? Object.keys(obj) as string[] : [];
  }

  // New method to safely get values from DataItem
  getItemValue(item: DataItem, key: string): string | File | undefined {
    return item ? (item as any)[key] : undefined;
  }

  handleSearch(): void {
    // Filter data based on the search keyword
    if (this.searchKeyword) {
      this.displayedData = this.data.filter(item =>
        this.getObjectKeys(item).some(key =>
          this.getItemValue(item, key)?.toString().toLowerCase().includes(this.searchKeyword.toLowerCase())
        )
      );
    } else {
      // If search keyword is empty, use default or retain the latest n rows
      this.updateDisplayedData();
    }
  }
}
