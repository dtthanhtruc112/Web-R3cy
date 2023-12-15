import { Component, OnInit } from '@angular/core';
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

  selectedCode: any;
  // pid!: number;

  constructor(private productService: ProductService, private _router: Router, private _activatedRoute: ActivatedRoute) {}

  // ngOnInit(): void {
  //   this.productService.getData().subscribe(
  //     {next: (dat) => this.product = dat, 
  //       error: (err) => this.errMsg = err.message
      
  //     } );
  // }

  ngOnInit() {
    this.productService.getData().subscribe((data: product[]) => {
      this.product = data;
    });
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
  

