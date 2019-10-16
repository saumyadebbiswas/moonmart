import { Component, OnInit } from '@angular/core';
import { BarcodeScannerOptions, BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { AlertController, LoadingController } from '@ionic/angular';
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

  constructor(
    private router: Router,
    public alertCtrl: AlertController,
    public loadingController: LoadingController,
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

  ionViewWillEnter() {
    //console.log('Barcode scanner enter...');
    this.barcodeScanner.scan().then(async barcodeData => {
      let barcode = barcodeData.text;

      const loading = await this.loadingController.create({
        message: 'Please wait...'
      });
      loading.present();
  
      this.productService.product_details_by_barcode(barcode).subscribe(async response => {
        loading.dismiss();
        if(response.Result == true) {
          if(response.Data[0].IsActive == 'Y') {
            //--- Get the product id and navigate to product details page
            let productId = response.Data[0].ProductID;
            this.router.navigate(['/productsdetails/'+productId]);

          } else {
            const alert = await this.alertCtrl.create({
              message: 'This product is no more avialble.',
              buttons: ['OK']
            });
            alert.present();
            this.router.navigate(['/alert']);
          }
        } else {
          const alert = await this.alertCtrl.create({
            message: response.Message,
            buttons: ['OK']
          });
          alert.present();
          this.router.navigate(['/alert']);
        }
      }, async error => {
        //--- In case of error - dismiss loader and show error message
        loading.dismiss();
        const alert = await this.alertCtrl.create({
          message: 'Internal Error: ' + error,
          buttons: ['OK']
        });
        alert.present();
        this.router.navigate(['/alert']);
      });

    }).catch(async err => {
      const alert = await this.alertCtrl.create({
        message: "Internal error: " + err,
        buttons: ['OK']
      });
      alert.present();
      this.router.navigate(['/alert']);
    });
  }

}
