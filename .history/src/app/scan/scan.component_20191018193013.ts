import { Component, OnInit } from '@angular/core';
import { BarcodeScannerOptions, BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Router } from '@angular/router';
import { ProductService, UserService } from '../services';

@Component({
  selector: 'app-scan',
  templateUrl: './scan.component.html',
  styleUrls: ['./scan.component.scss'],
})
export class ScanComponent implements OnInit {
  
  scannedData: any = [];
  barcodeScannerOptions: BarcodeScannerOptions;
  showLoader: boolean;
  showErrorAlert: boolean;
  error_message: string;

  constructor(
    private router: Router,
    private barcodeScanner: BarcodeScanner,
    private userService: UserService,
    private productService: ProductService
  ) {
    //--- Redirect to login page if user not log in
    if(this.userService.currentUserValue){
      console.log('Location: ScanComponent');

      //--- Options of barcode
      this.barcodeScannerOptions = {
        showTorchButton: true,
        showFlipCameraButton: true
      };
    } else {			 
      this.router.navigate(['/login']);
    }
  }

  ngOnInit() {}

  hideErrorAlert() {
    this.showErrorAlert = false;

    this.router.navigate(['/alert']);
  }

  ionViewWillEnter() {
    //console.log('Barcode scanner enter...');
    this.barcodeScanner.scan().then(async barcodeData => {
      let barcode = barcodeData.text;

      this.showLoader = true;
  
      this.productService.product_details_by_barcode(barcode).subscribe(response => {
        // loading.dismiss();
        this.showLoader = false;
        if(response.Result == true) {
          if(response.Data[0].IsActive == 'Y') {
            //--- Get the product id and navigate to product details page
            let productId = response.Data[0].ProductID;
            this.router.navigate(['/productsdetails/'+productId]);

          } else {
            this.showErrorAlert = true;
            this.error_message = 'This product is no more avialble!';
          }
        } else {
          this.showErrorAlert = true;
          this.error_message = 'No product found!';
        }
      }, error => {
        //--- In case of error - dismiss loader and show error message
        this.showLoader = false;
        this.showErrorAlert = true;
        this.error_message = 'Internal problem!';
      });

    }).catch(async err => {
      this.showErrorAlert = true;
      this.error_message = err;
    });
  }

}
