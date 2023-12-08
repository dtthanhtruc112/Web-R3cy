import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChinhsachComponent } from './chinhsach/chinhsach.component';
import { QnAComponent } from './qn-a/qn-a.component';
import { TrangtaikhoanComponent } from './trangtaikhoan/trangtaikhoan.component';
import { HttpClientModule } from '@angular/common/http';
import { AdminVanchuyenComponent } from './admin-vanchuyen/admin-vanchuyen.component';
import { AdminDonhangComponent } from './admin-donhang/admin-donhang.component';
import { HeaderComponent } from './header/header.component';
import { ProductCartComponent } from './product-cart/product-cart.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ForgotPassComponent } from './forgot-pass/forgot-pass.component';
import { OtpCodeComponent } from './forgot-pass/otp-code/otp-code.component';
import { NewPassComponent } from './forgot-pass/otp-code/new-pass/new-pass.component';
import { CustomProductComponent } from './custom-product/custom-product.component';
import { MainPageComponent } from './main-page/main-page.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component'


@NgModule({
  declarations: [
    AppComponent,
    ChinhsachComponent,
    QnAComponent,
    TrangtaikhoanComponent,
    AdminVanchuyenComponent,
    AdminDonhangComponent,
    HeaderComponent,
    ProductCartComponent,
    AboutUsComponent,
    LoginComponent,
    SignUpComponent,
    ForgotPassComponent,
    OtpCodeComponent,
    NewPassComponent,
    CustomProductComponent,
    MainPageComponent,
    PageNotFoundComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,    
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }