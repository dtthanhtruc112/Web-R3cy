import { Component, OnInit } from '@angular/core';
import { AccountCustomer } from '../Interface/AccountCustomer';
import { AccountcustomerService } from '../Service/accountcustomer.service';

@Component({
  selector: 'app-admin-account',
  templateUrl: './admin-account.component.html',
  styleUrl: './admin-account.component.css'
})
export class AdminAccountComponent implements OnInit {
  account = new AccountCustomer();
  errMessage: string = '';
  userData: AccountCustomer[] = [];
  isPhoneNumberValid: boolean = true;
  phoneNumberExist = true;
  phoneNumbers: any;
  isAddAdminPopupVisible = false;
  // Define custom column names
  customColumnNames: string[] = ['STT', 'Tên', 'Email', 'Số điện thoại', 'Tùy chỉnh'];
  
  constructor(
    private _service: AccountcustomerService,
  ) {}
  
  ngOnInit(): void {
    this.getAdminAccounts(); // Gọi hàm getAdminAccounts khi component được khởi tạo
  }

  getAdminAccounts(): void {
    this._service.getAdminAccounts().subscribe(
      (data) => {
        this.userData = data;
      },
      (error) => {
        console.error('Error fetching admin accounts:', error);
      }
    );
  } 

  // Variables to manage editing
  isEditing: boolean = false;
  editedUserId: number | null = null;
  editedUser: any = {};

  // Functions to handle edit, save, and delete actions
  handleEditClick(userId: number): void {
    this.isEditing = true;
    this.editedUserId = userId;
    // Find the user being edited and assign its data to editedUser
    this.editedUser = { ...this.userData.find(user => user._id === userId) };
  }

  handleSaveClick(): void {
    const { _id, ...updatedData } = this.editedUser;

    this._service.updateAdminAccount(_id, updatedData).subscribe(
      (updatedAccount) => {
        console.log('Account updated successfully:', updatedAccount);
        // Sau khi cập nhật thành công, có thể làm những thay đổi cần thiết, ví dụ như thông báo hoặc làm mới dữ liệu
        this.isEditing = false;
        this.editedUserId = null;
        this.editedUser = {};
        this.getAdminAccounts(); // Lấy dữ liệu mới sau khi cập nhật
        alert('Cập nhật thông tin thành công!');
      },
      (error) => {
        console.error('Error updating account:', error);
      }
    );
  }

  handleDeleteClick(userId: number): void {
    // Implement your logic to confirm deletion
    const confirmDelete = confirm('Bạn có muốn xóa tài khoản admin này?');

    if (confirmDelete) {
      this._service.deleteAdminAccount(userId.toString()).subscribe(
        () => {
          console.log('Account deleted successfully');
          // Additional logic for actual deletion, e.g., updating UI or reloading data
          this.userData = this.userData.filter(user => user._id !== userId);
          alert('Xóa tài khoản thành công!');
        },
        (error) => {
          console.error('Error deleting account:', error);
        }
      );
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

  isValidPassword: boolean =true;
  checkPassword(): void {
    // Kiểm tra mật khẩu có ít nhất 6 ký tự, chứa ít nhất một chữ cái, một số và một ký tự đặc biệt
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

    if (this.account.password.trim().length === 0) {
      this.isValidPassword = true;
      alert('Vui lòng nhập mật khẩu!');
    } else if (!passwordRegex.test(this.account.password)) {
      alert('Mật khẩu phải có ít nhất 6 ký tự, chứa ít nhất một chữ cái, một số và một ký tự đặc biệt!');
    }
  }

  handleAddAdmin(): void {
    console.log(this.account)
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
          alert('Đăng ký tài khoản admin thành công!');
          this.getAdminAccounts(); // Lấy dữ liệu mới sau khi cập nhật
        },
        error: (err) => {
          this.errMessage = err;
          alert('Đăng ký không thành công');
        },
      });
    }
    // Đóng popup sau khi thêm admin
    this.toggleAddAdminPopup();
  }
}
