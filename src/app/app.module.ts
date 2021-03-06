import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { DatePicker } from '@ionic-native/date-picker/ngx';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
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

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    LoginComponent,
    ForgotComponent,
    ProductlistComponent,
    OrderreceivedComponent,
    NotificationsComponent,
    ProductsdetailsComponent,
    ProfileComponent,
    ScanComponent,
    EnquiryComponent,
    AlertComponent,
    OfferproductsComponent,
    OfferproductdetailsComponent,
    DashboardComponent,
    PrivacyPolicyComponent,
    TermsNConditionComponent
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    DatePicker,
    BarcodeScanner,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
