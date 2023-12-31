import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from 'express';
import { DiscountService } from '../Service/discount.service';
import { map, switchMap } from 'rxjs';
import { Discount } from '../Interface/discount';

@Component({
  selector: 'app-admin-chitietmgg',
  templateUrl: './admin-chitietmgg.component.html',
  styleUrl: './admin-chitietmgg.component.css'
})
export class AdminChitietmggComponent implements OnInit{

  selectedCode!: string;
  pro: any;
  discount: any;

  constructor(private router: Router, private _router: ActivatedRoute, private discountService: DiscountService) { }

  ngOnInit(): void {
    this._router.paramMap.pipe(
      map(params => this.selectedCode = String(params.get('id'))),
      switchMap(id => this.discountService.getDiscountById(id).pipe(
        switchMap(pro => this.discountService.getData().pipe(
        ))
        // ))
      )))

      .subscribe(data => {
        this.pro = data;
        console.log(this.pro);
        this.discount = this.pro.find((Discount: { _id: string; }) => Discount._id === this.selectedCode);
        console.log('this.productt', this.discount);
      })
  }

}
