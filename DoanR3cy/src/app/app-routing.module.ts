import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgotPassComponent } from './forgot-pass/forgot-pass.component';
import { OtpCodeComponent } from './forgot-pass/otp-code/otp-code.component';
import { NewPassComponent } from './forgot-pass/otp-code/new-pass/new-pass.component';
import { LoginComponent } from './login/login.component';
import { MainPageComponent } from './main-page/main-page.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import {CustomProductComponent} from './custom-product/custom-product.component'
import { ChinhsachComponent } from './chinhsach/chinhsach.component';
import { QnAComponent } from './qn-a/qn-a.component';
import { TrangtaikhoanComponent } from './trangtaikhoan/trangtaikhoan.component';
import { ProductCartComponent } from './product-cart/product-cart.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { TimkiemComponent } from './timkiem/timkiem.component';
import { BlogComponent } from './blog/blog.component';
import { DetailBlogComponent } from './detail-blog/detail-blog.component';
import { AdminCreateBlogComponent } from './admin-create-blog/admin-create-blog.component';
import { TongquanComponent } from './admin-tongquan/tongquan.component';
import { AdminSidebarComponent } from './admin-sidebar/admin-sidebar.component';
import { ManageBlogComponent } from './manage-blog/manage-blog.component';

const routes: Routes = [
  { path: 'sign-up', component: SignUpComponent},
  { path: 'login', component: LoginComponent },
  { path: 'main-page', component: MainPageComponent },
  { path: 'forgot-pass', component: ForgotPassComponent },
  { path: 'otp-code', component: OtpCodeComponent },
  { path: 'new-pass', component: NewPassComponent },
  { path: 'custom-product', component: CustomProductComponent},
  { path: 'chinhsach', component: ChinhsachComponent},
  { path: 'QnA', component: QnAComponent},
  { path: 'trangtaikhoan', component: TrangtaikhoanComponent},
  { path: 'product-cart', component: ProductCartComponent},
  { path: 'aboutus', component: AboutUsComponent},
  { path: 'blogs', component: BlogComponent },
  { path: 'detail/:id', component: DetailBlogComponent },
  { path: 'timkiem', component: TimkiemComponent},
  { path: 'createblog', component: AdminCreateBlogComponent},
  { path: 'tongquan', component: TongquanComponent},
  { path: 'sidebar', component: AdminSidebarComponent},
  { path: 'manageblog', component: ManageBlogComponent},
  // { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/manageblog', pathMatch: 'full' }, // Trang mặc định
  {path: "**", component: PageNotFoundComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
