import { Component } from '@angular/core';

@Component({
  selector: 'app-product-checkout',
  templateUrl: './product-checkout.component.html',
  styleUrl: './product-checkout.component.css'
})
export class ProductCheckoutComponent {
  customer: { name: string } = { name: '' };
  nameInvalid = false;
  nameTouched = false;

  checkNameValidity(): void {
    this.nameInvalid = this.customer.name.trim() === '';
    this.nameTouched = true;
  }

  clearValidation(): void {
    this.nameInvalid = false;
    this.nameTouched = false;
  }
  handleCountrySelection(value: string): void {
    if (value === 'other') {
      const otherCountryInput = document.getElementById('otherCountryInput') as HTMLInputElement;
      otherCountryInput.style.display = 'block';
      otherCountryInput.focus();
    } else {
      const otherCountryInput = document.getElementById('otherCountryInput') as HTMLInputElement;
      otherCountryInput.style.display = 'none';
    }
  }
  // Hiện popup
  showOverlay: boolean = false;
  showSuccessPopup: boolean = false;
  showCancelPopup: boolean = false;
  cdr: any;

  closePopup(): void {
    console.log('Closing popup...');
    this.showOverlay = false;
    this.showSuccessPopup = false;
    //  this.addressPopup = false;
    this.showCancelPopup = false
  }
  saveData(): void {
    // alert('Đã lưu thông tin');
    // Hiển thị overlay
    this.showOverlay = true;

    // Hiển thị popup
    this.showSuccessPopup = true;

    // Ẩn popup sau 3 giây (3000 milliseconds)
    setTimeout(() => {
      this.closePopup();
      this.cdr.detectChanges(); // Manually trigger change detection
    }, 3000);
  }


}
