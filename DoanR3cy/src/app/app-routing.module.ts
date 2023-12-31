import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgotPassComponent } from './forgot-pass/forgot-pass.component';
import { NewPassComponent } from './forgot-pass/new-pass/new-pass.component';
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
import { ManageBlogComponent } from './manage-blog/manage-blog.component';
import { ProductComponent } from './product/product.component';
import { ProductListComponent } from './product-list/product-list.component';
import { DanhgiasanphamComponent } from './danhgiasanpham/danhgiasanpham.component';
import { ProductCheckoutComponent } from './product-checkout/product-checkout.component';
import { ThugomComponent } from './thugom/thugom.component';
import { CartIconComponent } from './cart-icon/cart-icon.component';

const routes: Routes = [
  { path: 'sign-up', component: SignUpComponent},
  { path: 'login', component: LoginComponent },
  { path: 'main-page', component: MainPageComponent },
  { path: 'forgot-pass', component: ForgotPassComponent },
  { path: 'new-pass', component: NewPassComponent },
  { path: 'custom-product', component: CustomProductComponent},
  { path: 'chinhsach', component: ChinhsachComponent},
  { path: 'chinhsach/:id', component: ChinhsachComponent},
  { path: 'QnA', component: QnAComponent},
  { path: 'QnA/:id', component: QnAComponent},
  { path: 'trangtaikhoan', component: TrangtaikhoanComponent},
  { path: 'trangtaikhoan/:id', component: TrangtaikhoanComponent},
  // { path: 'product-cart', component: ProductCartComponent},
  { path: 'cart', component: ProductCartComponent},
  { path: 'aboutus', component: AboutUsComponent},
  { path: 'blog', component: BlogComponent },
  // { path: 'detail/:id', component: DetailBlogComponent },
  { path: 'blog/:id', component: DetailBlogComponent },
  // { path: 'timkiem', component: TimkiemComponent},
  {
    path: 'timkiem',
    component: TimkiemComponent,
    children: [
      { path: '', component: ProductListComponent } // Route con để hiển thị app-product
    ]
  },
  { path: 'manageblog', component: ManageBlogComponent},
  { path: 'product-list', component: ProductListComponent},
  { path: 'product/:id', component: ProductComponent},
  { path: 'danhgia/:id', component: DanhgiasanphamComponent},
  { path: 'checkout', component: ProductCheckoutComponent},
  { path: 'thugom', component: ThugomComponent},
  { path: 'carticon', component: CartIconComponent},
  // { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/main-page', pathMatch: 'full' }, // Trang mặc định
  {path: "**", component: PageNotFoundComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const RoutingComponent=[
  SignUpComponent,
  LoginComponent,
  MainPageComponent,
  ForgotPassComponent,
  NewPassComponent,
  CustomProductComponent,
  ChinhsachComponent,
  QnAComponent,
  TrangtaikhoanComponent,
  ProductCartComponent,
  AboutUsComponent,
  BlogComponent,
  DetailBlogComponent,
  TimkiemComponent,
  ManageBlogComponent,
  ProductListComponent,
  ProductComponent,
  DanhgiasanphamComponent,
  ProductCheckoutComponent,
  ThugomComponent,
  PageNotFoundComponent

]

