import { Component } from '@angular/core';
import { ProductService } from '../Service/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { product } from '../Interface/product';

@Component({
  selector: 'app-danhgiasanpham',
  templateUrl: './danhgiasanpham.component.html',
  styleUrl: './danhgiasanpham.component.css'
})
export class DanhgiasanphamComponent {
  product: any;
  errMsg: string ="";

  constructor(private productService: ProductService, private _router: Router, private _activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.productService.getData().subscribe((data: product[]) => {
      this.product = data;
    });
  }
}
