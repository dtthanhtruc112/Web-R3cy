import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-account',
  templateUrl: './admin-account.component.html',
  styleUrls: ['./admin-account.component.css']
})
export class AdminAccountComponent {
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

  handleAddAdmin(): void {
    // Add a new row to userData with default values
    const newAdmin = {
      id: this.userData.length + 1,
      name: 'New Admin',
      email: 'newadmin@example.com',
      phone: '1234567890'
    };

    this.userData.push(newAdmin);
  }
}
