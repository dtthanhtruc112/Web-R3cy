import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChinhsachComponent } from './chinhsach/chinhsach.component';
import { QnAComponent } from './qn-a/qn-a.component';
import { TrangtaikhoanComponent } from './trangtaikhoan/trangtaikhoan.component';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from './header/header.component';
import { ProductCartComponent } from './product-cart/product-cart.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ForgotPassComponent } from './forgot-pass/forgot-pass.component';
import { NewPassComponent } from './forgot-pass/new-pass/new-pass.component';
import { CustomProductComponent } from './custom-product/custom-product.component';
import { MainPageComponent } from './main-page/main-page.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { TimkiemComponent } from './timkiem/timkiem.component';
import { BlogComponent } from './blog/blog.component';
import { DetailBlogComponent } from './detail-blog/detail-blog.component';
import { ManageBlogComponent } from './manage-blog/manage-blog.component';
import { ProductComponent } from './product/product.component';
import { ProductListComponent } from './product-list/product-list.component';
import { DanhgiasanphamComponent } from './danhgiasanpham/danhgiasanpham.component';
import { ProductCheckoutComponent } from './product-checkout/product-checkout.component';
import { RouterModule, Routes, Router, NavigationEnd } from '@angular/router';
import { CartIconComponent } from './cart-icon/cart-icon.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { BadgeModule } from 'primeng/badge';
import { CartService } from './Service/cart.service';




@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    AppComponent,
    ChinhsachComponent,
    QnAComponent,
    TrangtaikhoanComponent,
    HeaderComponent,
    ProductCartComponent,
    AboutUsComponent,
    LoginComponent,
    SignUpComponent,
    ForgotPassComponent,
    NewPassComponent,
    CustomProductComponent,
    MainPageComponent,
    TimkiemComponent,
    BlogComponent,
    DetailBlogComponent,
    ManageBlogComponent, ProductComponent, ProductListComponent, DanhgiasanphamComponent,
    PageNotFoundComponent,
    ProductCheckoutComponent,
    CartIconComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,    
    HttpClientModule,
    InputNumberModule,
    BadgeModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private router: Router, cartService: CartService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0); // Cuộn lên đầu trang sau mỗi navigation
      }
    });

  };
}
