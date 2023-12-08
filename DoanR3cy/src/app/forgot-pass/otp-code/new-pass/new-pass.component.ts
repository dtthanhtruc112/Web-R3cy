import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-pass',
  templateUrl: './new-pass.component.html',
  styleUrls: ['./new-pass.component.css']
})
export class NewPassComponent {
  newPassForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private router: Router) {
    this.newPassForm = this.formBuilder.group({
      newPass: ['', [Validators.required]],
      reNewPass: ['', [Validators.required]]
    });
  }

  // submitForm() {
  //   const newPass = this.newPassForm.value.newPass;
  //   const reNewPass = this.newPassForm.value.reNewPass;

  //   // Kiểm tra nếu form hợp lệ và mật khẩu mới khớp
  //   // if (this.newPassForm.valid && newPass === reNewPass) {
  //     // Thông báo thành công
  //   if (this.newPassForm.valid && newPass === reNewPass) {
  //     // Chuyển đến trang main-page nếu form hợp lệ
  //     alert('Mật khẩu mới đã được cập nhật thành công!');
  //     setTimeout(() => {
  //       this.router.navigate(['/main-page']);
  //     }, 200);
  //   } else {
  //     // Hiển thị thông báo hoặc xử lý khi form không hợp lệ hoặc mật khẩu mới không khớp
  //     alert('Mật khẩu mới không khớp. Vui lòng kiểm tra lại!');
  //   }
  // }

  submitForm(): void  {
    const newPass = this.newPassForm.value.newPass;
    const reNewPass = this.newPassForm.value.reNewPass;

    // Kiểm tra xem tất cả các trường đã được tương tác (chạm) chưa
    if (this.newPassForm.touched) {
      // Kiểm tra xem tất cả các trường đã được điền và làm mới trang nếu hợp lệ
      // Kiểm tra nếu form hợp lệ và mật khẩu mới khớp
      // if (this.newPassForm.valid && newPass === reNewPass) {
      // Thông báo thành công
      if (this.newPassForm.valid && newPass === reNewPass) {
      // Chuyển đến trang main-page nếu form hợp lệ
        alert('Mật khẩu mới đã được cập nhật thành công!');
        setTimeout(() => {
        this.router.navigate(['/main-page']);
      }, 200);
      } else {
        // Hiển thị thông báo hoặc xử lý khi form không hợp lệ hoặc mật khẩu mới không khớp
        alert('Mật khẩu mới không khớp. Vui lòng kiểm tra lại!');
      }
    } else {
      // Hiển thị cảnh báo khi người dùng chưa tương tác với các trường
      alert('Vui lòng nhập đầy đủ thông tin.');
    }
  }


}
