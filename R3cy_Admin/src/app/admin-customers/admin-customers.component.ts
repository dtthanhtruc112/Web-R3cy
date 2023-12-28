import { Component } from '@angular/core';
import { Users } from '../Interface/users';
import { UsersService } from '../Service/users.service';

@Component({
  selector: 'app-admin-customers',
  templateUrl: './admin-customers.component.html',
  styleUrl: './admin-customers.component.css'
})
export class AdminCustomersComponent {
  errMessage: string = '';
  data: Users[] = [];
  displayedData: Users[] = [];
  sortColumn: number | 'all' = 'all';
  searchKeyword: string = '';


  customColumnNames: string[] = ['Họ và tên', 'Email', 'Số điện thoại', 'Địa chỉ', 'Ngày sinh'];


  constructor(private uersService: UsersService) {}

  ngOnInit(): void {
    this.uersService.getCustomers().subscribe(data => {
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

 
  getObjectKeys(obj: Users): string[] {
    return obj ? Object.keys(obj) as string[] : [];
  }

  getItemValue(item: Users, key: string): string | File | undefined {
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

  // constructor( private _service: UsersService) {}

  // ngOnInit(): void {
  //   this.getCustomers(); 
  // }
  // getCustomers(): void {
  //   this._service.getCustomers().subscribe(
  //     (data) => {
  //       this.customerData = data;
  //     },
  //     (error) => {
  //       console.error('Error fetching customers information:', error);
  //     }
  //   );
  //   this.updateDisplayedData();
  // } 

  // sortTable(): void {
  //   this.updateDisplayedData();
  // }

  // updateDisplayedData(): void {
  //   this.displayedData = this.sortColumn === 'all' ? [...this.customerData] : this.customerData.slice(0, this.sortColumn);
  // }

  // // getFileDisplayName(file: File): string {
  // //   return file.name;
  // // }

  // getObjectKeys(obj: Users): string[] {
  //   return obj ? Object.keys(obj) as string[] : [];
  // }

  // getItemValue(item: Users, key: string): string | File | undefined {
  //   console.log(key)
  //   return item ? (item as any)[key] : undefined;
  // }

  // handleSearch(): void {
  //   if (this.searchKeyword) {
  //     this.displayedData = this.customerData.filter(item =>
  //       this.getObjectKeys(item).some(key =>
  //         this.getItemValue(item, key)?.toString().toLowerCase().includes(this.searchKeyword.toLowerCase())
  //       )
  //     );
  //   } else {
  //     this.updateDisplayedData();
  //   }
  // }
}
