import { Component, OnInit } from '@angular/core';
import { product } from '../Interface/product';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../Service/product.service';
import { map, switchMap } from 'rxjs';


@Component({
  selector: 'app-product-cart',
  templateUrl: './product-cart.component.html',
  styleUrl: './product-cart.component.css'
})
export class ProductCartComponent {
  product: any;
  errMsg: string ="";

  selectedCode: any;
  constructor(private productService: ProductService, private _router: Router, private _activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.productService.getData().subscribe((data: product[]) => {
      this.product = data;
    });
  }


  

}
