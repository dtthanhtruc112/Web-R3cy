import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../Service/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { product } from '../Interface/product';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit{
  
  selectedCode: number | undefined;
  product: product[] = [];
  pro: product | product[] = [];
  productt: any;

  constructor(private productService: ProductService, private _router: ActivatedRoute){}

  ngOnInit(): void {
    this._router.paramMap.pipe(
      map(params => this.selectedCode = Number(params.get('id'))),
      switchMap(id => this.productService.getProductById(id).pipe(
        switchMap(pro => this.productService.getData().pipe(
        //   map(products => ({ product, relatedBlogs: product.filter(p => p.id !== id).slice(0, 3) }))
        ))
        // ))
      )))
      
      
    .subscribe(data => {
      this.pro = data;
      console.log(this.pro);
      this.productt = this.pro[(this.selectedCode as number - 1)];
      console.log(this.productt);
  })
  console.log(this.selectedCode);
}}