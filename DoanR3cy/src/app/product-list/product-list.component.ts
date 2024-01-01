import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ProductService } from '../Service/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { product } from '../Interface/product';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {

  product: any;
  errMsg: string ="";
  isCateOpt1Checked: boolean = false;
  isCateOpt2Checked: boolean = false;
  isCateOpt3Checked: boolean = false;
  isPriceOpt1Checked: boolean = false;
  isPriceOpt2Checked: boolean = false;
  isPriceOpt3Checked: boolean = false;
  isPriceOpt4Checked: boolean = false;

  selectedCode: any;
  // pid!: number;

  

  constructor(private productService: ProductService, private _router: Router, private _activatedRoute: ActivatedRoute,  private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.productService.getData().subscribe((data: product[]) => {
      this.product = data;
    });
    this.cdr.detectChanges();
   
  }

  clearStatus(){
    this.isCateOpt1Checked = false;
    this.isCateOpt2Checked = false;
    this.isCateOpt3Checked = false;

    this.isPriceOpt1Checked = false;
    this.isPriceOpt2Checked = false;
    this.isPriceOpt3Checked = false;
    this.isPriceOpt4Checked = false;
  }

  onCheckboxChange() {
    if (this.isCateOpt1Checked) {
      console.log('Checkbox 1 được chọn');
      if (this.isCateOpt1Checked) {
        // Gọi phương thức mới của productService để lấy dữ liệu theo loại sản phẩm
        this.productService.getDataByCategory('gia-dung').subscribe(
          (data) => {
            this.product = data;
          },
          (error) => {
            console.error('Error fetching data:', error);
          }
        );
    } else {
      console.log('Checkbox 1 không được chọn');
      // Nếu checkbox không được chọn, lấy dữ liệu theo URL ban đầu
      this.productService.getData().subscribe(
        (data) => {
          this.product = data;
        },
        (error) => {
          console.error('Error fetching data:', error);
        }
      );
    }
  }

  if (this.isCateOpt2Checked) {
    console.log('Checkbox 2 được chọn');
    if (this.isCateOpt2Checked) {
      // Gọi phương thức mới của productService để lấy dữ liệu theo loại sản phẩm
      this.productService.getDataByCategory('trang-tri').subscribe(
        (data) => {
          this.product = data;
        },
        (error) => {
          console.error('Error fetching data:', error);
        }
      );
  } else {
    console.log('Checkbox 2 không được chọn');
    // Nếu checkbox không được chọn, lấy dữ liệu theo URL ban đầu
    this.productService.getData().subscribe(
      (data) => {
        this.product = data;
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }
}

if (this.isCateOpt3Checked) {
  console.log('Checkbox3 được chọn');
  if (this.isCateOpt3Checked) {
    // Gọi phương thức mới của productService để lấy dữ liệu theo loại sản phẩm
    this.productService.getDataByCategory('phu-kien').subscribe(
      (data) => {
        this.product = data;
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
} else {
  console.log('Checkbox 3 không được chọn');
  // Nếu checkbox không được chọn, lấy dữ liệu theo URL ban đầu
  this.productService.getData().subscribe(
    (data) => {
      this.product = data;
    },
    (error) => {
      console.error('Error fetching data:', error);
    }
  );
}
}

if (this.isPriceOpt1Checked) {
  console.log('Checkbox giá 1 được chọn');
  if (this.isPriceOpt1Checked) {
    // Gọi phương thức mới của productService để lấy dữ liệu theo loại sản phẩm
    this.productService.getDataByCategory('duoi-100').subscribe(
      (data) => {
        this.product = data;
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
} else {
  console.log('Checkbox giá 1 không được chọn');
  // Nếu checkbox không được chọn, lấy dữ liệu theo URL ban đầu
  this.productService.getData().subscribe(
    (data) => {
      this.product = data;
    },
    (error) => {
      console.error('Error fetching data:', error);
    }
  );
}
}

if (this.isPriceOpt2Checked) {
  console.log('Checkbox giá 2 được chọn');
  if (this.isPriceOpt2Checked) {
    // Gọi phương thức mới của productService để lấy dữ liệu theo loại sản phẩm
    this.productService.getDataByCategory('100-den-200').subscribe(
      (data) => {
        this.product = data;
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
} else {
  console.log('Checkbox giá 2 không được chọn');
  // Nếu checkbox không được chọn, lấy dữ liệu theo URL ban đầu
  this.productService.getData().subscribe(
    (data) => {
      this.product = data;
    },
    (error) => {
      console.error('Error fetching data:', error);
    }
  );
}
}

if (this.isPriceOpt3Checked) {
  console.log('Checkbox giá 3 được chọn');
  if (this.isPriceOpt3Checked) {
    // Gọi phương thức mới của productService để lấy dữ liệu theo loại sản phẩm
    this.productService.getDataByCategory('200-den-300').subscribe(
      (data) => {
        this.product = data;
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
} else {
  console.log('Checkbox giá 3 không được chọn');
  // Nếu checkbox không được chọn, lấy dữ liệu theo URL ban đầu
  this.productService.getData().subscribe(
    (data) => {
      this.product = data;
    },
    (error) => {
      console.error('Error fetching data:', error);
    }
  );
}
}

if (this.isPriceOpt4Checked) {
  console.log('Checkbox giá 4 được chọn');
  if (this.isPriceOpt4Checked) {
    // Gọi phương thức mới của productService để lấy dữ liệu theo loại sản phẩm
    this.productService.getDataByCategory('tren-300').subscribe(
      (data) => {
        this.product = data;
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
} else {
  console.log('Checkbox giá 4 không được chọn');
  // Nếu checkbox không được chọn, lấy dữ liệu theo URL ban đầu
  this.productService.getData().subscribe(
    (data) => {
      this.product = data;
    },
    (error) => {
      console.error('Error fetching data:', error);
    }
  );
}
}

  // onSelect(obj: any){
  //   this._router.navigate(["/product", obj.code])
  // }

  // isSelected(obj:any){
  //   // if(obj.code === this.selectedCode)
  //   //   return true
  //   // else
  //   //   return false

  //   return obj.code === this.selectedCode
  }
  

  // openProductDetail() {
  //   const productId = this.pid;
  //   this.router.navigate(['product-detail', productId]);
  // }

}
  

