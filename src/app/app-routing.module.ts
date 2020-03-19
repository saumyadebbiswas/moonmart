import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { ForgotComponent } from './forgot/forgot.component';
import { ProductlistComponent } from './productlist/productlist.component';
import { OrderreceivedComponent } from './orderreceived/orderreceived.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { ProductsdetailsComponent } from './productsdetails/productsdetails.component';
import { ProfileComponent } from './profile/profile.component';
import { ScanComponent } from './scan/scan.component';
import { EnquiryComponent } from './enquiry/enquiry.component';
import { AlertComponent } from './alert/alert.component';
import { OfferproductsComponent } from './offerproducts/offerproducts.component';
import { OfferproductdetailsComponent } from './offerproductdetails/offerproductdetails.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TermsNConditionComponent } from './terms-n-condition/terms-n-condition.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'list',
    loadChildren: () => import('./list/list.module').then(m => m.ListPageModule)
  },
  { path: "dashboard",  component: DashboardComponent},
  { path: "singup",  component: SignupComponent},
  { path: "login",  component: LoginComponent},
  { path: "forgot",  component: ForgotComponent},
  { path: "productlist",  component: ProductlistComponent},
  { path: "orderreceive",  component: OrderreceivedComponent},
  { path: "notifications",  component: NotificationsComponent},
  { path: "productsdetails/:id",  component: ProductsdetailsComponent},
  { path: "profile",  component: ProfileComponent},
  { path: "scan",  component: ScanComponent},
  { path: "enquiry",  component: EnquiryComponent},
  { path: "alert",  component: AlertComponent},
  { path: "offerproducts",  component: OfferproductsComponent},
  { path: "offerproductdetails",  component: OfferproductdetailsComponent},
  { path: "privacypolicy",  component: PrivacyPolicyComponent},
  { path: "termncondition",  component: TermsNConditionComponent}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
