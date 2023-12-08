import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgotPassComponent } from './forgot-pass/forgot-pass.component';
import { OtpCodeComponent } from './forgot-pass/otp-code/otp-code.component';
import { NewPassComponent } from './forgot-pass/otp-code/new-pass/new-pass.component';
import { LoginComponent } from './login/login.component';
import { MainPageComponent } from './main-page/main-page.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import {CustomProductComponent} from './custom-product/custom-product.component'

const routes: Routes = [
  { path: 'sign-up', component: SignUpComponent},
  { path: 'login', component: LoginComponent },
  { path: 'main-page', component: MainPageComponent },
  { path: 'forgot-pass', component: ForgotPassComponent },
  { path: 'otp-code', component: OtpCodeComponent },
  { path: 'new-pass', component: NewPassComponent },
  { path: 'custom-product', component: CustomProductComponent},
  // { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/sign-up', pathMatch: 'full' }, // Trang mặc định
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
