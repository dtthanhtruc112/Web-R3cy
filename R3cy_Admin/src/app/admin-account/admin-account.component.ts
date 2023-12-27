import { Component } from '@angular/core';
<<<<<<< HEAD
import { AccountCustomer } from '../Interface/AccountCustomer';
import { AccountcustomerService } from '../Service/accountcustomer.service';
=======
import { FormsModule } from '@angular/forms';
>>>>>>> 7f4d70912f009cdbb7679042a577e5b73d9ceb82

@Component({
  selector: 'app-admin-account',
  templateUrl: './admin-account.component.html',
  styleUrl: './admin-account.component.css'
})
export class AdminAccountComponent {
  account = new AccountCustomer();
  errMessage: string = '';
  constructor(
    private _service: AccountcustomerService,
  ) {}
  public setAccount(a: AccountCustomer) {
    this.account = a;
  }

  isPhoneNumberValid: boolean = true;
  phoneNumberExist = true;
  phoneNumbers: any;
  isAddAdminPopupVisible = false;
  // newAdmin = { name: '', phone: '', email: '', password: '' };
  // Define custom column names
  customColumnNames: string[] = ['STT', 'Tên', 'Email', 'Số điện thoại', 'Tùy chỉnh'];
  
  // Sample data
  userData: any[] = [
    { id: 1, name: 'Người dùng 1', email: 'user1@example.com', phone: '123456789' },
    { id: 2, name: 'Người dùng 2', email: 'user2@example.com', phone: '987654321' }
    // Add more user data as needed
  ];

  // Variables to manage editing
  isEditing: boolean = false;
  editedUserId: number | null = null;
  editedUser: any = {};

  // Functions to handle edit, save, and delete actions
  handleEditClick(userId: number): void {
    this.isEditing = true;
    this.editedUserId = userId;
    // Find the user being edited and assign its data to editedUser
    this.editedUser = this.userData.find(user => user.id === userId);
  }

  handleSaveClick(): void {
    // Save the changes to the original user data
    const index = this.userData.findIndex(user => user.id === this.editedUserId);
    if (index !== -1) {
      this.userData[index] = { ...this.editedUser };
      this.isEditing = false;
      this.editedUserId = null;
      this.editedUser = {};
    }
  }

  handleDeleteClick(userId: number): void {
    // Implement your logic to confirm deletion
    const confirmDelete = confirm('Bạn có muốn xóa tài khoản admin này?');

    if (confirmDelete) {
      this.userData = this.userData.filter(user => user.id !== userId);
      // Additional logic for actual deletion, e.g., calling a service
    }
  }

  toggleAddAdminPopup() {
    this.isAddAdminPopupVisible = !this.isAddAdminPopupVisible;
  }


  checkPhoneNumber(): void {
    const phoneNumberRegex = /^(\+84|0)[1-9][0-9]{7,8}$/; 
    if (this.account.phonenumber.trim().length === 0) {
      this.isPhoneNumberValid = true;
    } else {
      this.isPhoneNumberValid = phoneNumberRegex.test(this.account.phonenumber);
    }
  }

  isValidEmail: boolean =true;
  checkMail(){
    const MailRegex = /\S+@\S+\.\S+/; 
    if (this.account.Mail.trim().length === 0) {
      this.isValidEmail = true;
    } else {
      this.isValidEmail = MailRegex.test(this.account.Mail);
    }
  }

  handleAddAdmin(): void {
    // Add a new row to userData with default values
    // const newAdmin = {
    //   id: this.userData.length + 1,
    //   name: 'New Admin',
    //   email: 'newadmin@example.com',
    //   phone: '1234567890'
    // };
    if (!this.isPhoneNumberValid) {
      alert('Vui lòng nhập đúng số điện thoại!');
      return 
    }
    else if (!this.isValidEmail) {
      alert('Vui lòng nhập đúng email!');
      return  
    }else if(this.account.phonenumber.trim().length === 0 || this.account.Name.trim().length === 0 || this.account.password.trim().length === 0){
      alert('Vui lòng nhập đủ thông tin bắt buộc')
      return 
    }
    else {
      this._service.postAccount(this.account).subscribe({
        next: (data) => {
          this.account = data;
          // Đóng popup sau khi thêm admin
          this.toggleAddAdminPopup();
          alert('Đăng ký thành công');
        },
        error: (err) => {
          this.errMessage = err;
          alert('Đăng ký không thành công');
        },
      });
    }
  }

  
}
