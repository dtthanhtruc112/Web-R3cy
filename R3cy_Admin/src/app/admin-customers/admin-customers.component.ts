import { Component } from '@angular/core';
// import { Customer, Address } from '../Interface/users';
// import { UsersService } from '../Service/users.service';
import { AccountCustomer } from '../Interface/AccountCustomer';
import { AccountcustomerService } from '../Service/accountcustomer.service';

@Component({
  selector: 'app-admin-customers',
  templateUrl: './admin-customers.component.html',
  styleUrl: './admin-customers.component.css'
})
export class AdminCustomersComponent {
  errMessage: string = '';
  data: AccountCustomer[] = [];
  displayedData: AccountCustomer[] = [];
  sortColumn: number | 'all' = 'all';
  searchKeyword: string = '';


  customColumnNames: string[] = ['Họ và tên', 'Email', 'Số điện thoại', 'Địa chỉ', 'Ngày sinh'];


  constructor(private accountCustomerService: AccountcustomerService) {}

  ngOnInit(): void {
    this.accountCustomerService.getCustomers().subscribe(data => {
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

 
  getObjectKeys(obj: AccountCustomer): string[] {
    return obj ? Object.keys(obj) as string[] : [];
  }

  getItemValue(item: AccountCustomer, key: string): string | File | undefined {
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
