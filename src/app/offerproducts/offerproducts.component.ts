import { Component, OnInit } from '@angular/core';
import { BarcodeScannerOptions, BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { AlertController, LoadingController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService, ProductService } from '../services';
import { SITE_URL } from '../services/constants';

@Component({
  selector: 'app-offerproducts',
  templateUrl: './offerproducts.component.html',
  styleUrls: ['./offerproducts.component.scss'],
})
export class OfferproductsComponent implements OnInit {

  site_url: string;
  offerID: any;
  imagePath: string;
  imagePathFixed: string = "";
  products: any = []; //--- This product list changed in serch time
  products_fixed:any = []; //--- This product list remain fixed even in serch
  showOfferImage: any = true;
  barcodeScannerOptions: BarcodeScannerOptions;
  showLoader: boolean;

  constructor(
    private barcodeScanner: BarcodeScanner,
    public alertCtrl: AlertController,
    public loadingController: LoadingController,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private productService: ProductService
  ) {
    //--- Redirect to login page if user not log in
    if(this.userService.currentUserValue){
      console.log('Location: ProductlistComponent');

      this.site_url = SITE_URL;

      //--- Options of barcode
      this.barcodeScannerOptions = {
        showTorchButton: true,
        showFlipCameraButton: true
      };
    } else {			 
      this.router.navigate(['/login']);
    }
  }

  ngOnInit() {
    //--- Check parameter type get from URL
    if(this.route.snapshot.paramMap.get('type') == 'ID') {
      //--- Get parameter value from URL
      this.offerID = this.route.snapshot.paramMap.get('value');

      //--- Check image path get from URL and merge it with site_url
      if(this.route.snapshot.paramMap.get('imagePath') != null) {
        this.imagePath = this.site_url + this.route.snapshot.paramMap.get('imagePath');
        this.imagePathFixed = this.route.snapshot.paramMap.get('imagePath');
      } else {
        this.imagePath = '/assets/images/product-img.png'; //--- Default image [Set no-image-available]
      }
    } else {
      this.offerID = null;
    }
    // console.log('Offer product List offer ID...', this.offerID);
  }
 
  logScrolling(event){
    // console.log("logScrolling : When Scrolling", event.detail.currentY);
    let scrollingPos = event.detail.currentY;

    if(scrollingPos > 0) {
      //this.show_search = false;
      this.showOfferImage = false;
    } else {
      this.showOfferImage = true;
    }
  }

  async ionViewWillEnter() {
    // const loading = await this.loadingController.create({
    //   // message: '<ion-img src="/assets/spinner.gif" alt="Loading..."></ion-img>',
    //   // translucent: true,
    //   // showBackdrop: false,
    //   spinner: 'bubbles'
    // });
    // loading.present();
    this.showLoader = true;

    this.productService.products_by_offerID(this.offerID).subscribe(async response => {
      //--- After getting value - dismiss loader
      // loading.dismiss();
      this.showLoader = false;
      if(response.Result == true) {
        this.products_fixed =  response.Data;
        this.products = response.Data;
        //console.log('Offer product list...', this.products);
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
      // loading.dismiss();
      this.showLoader = false;
      const alert = await this.alertCtrl.create({
        message: 'Internal Error! Unable to load products.',
        buttons: ['OK']
      });
      alert.present();

      this.router.navigate(['/alert']);
    });
  }
  
  searchProduct(event) {
    let search_value = event.target.value;

    this.products = [];

    if(search_value.length >= 3) {
      //console.log('search value after 3 words...', search_value);
      this.products_fixed.forEach(element => {
        let product_name = element.ProductName.toLowerCase();
        search_value = search_value.toLowerCase();

        if(product_name.includes(search_value)) {
          this.products.push(element);
        }
      });
      //console.log('Product list after search...', this.products);
    } else {
      this.products = this.products_fixed;
    }
  }

  scanProduct() {
    //console.log('Barcode scanner enter...');
    this.barcodeScanner.scan().then(async barcodeData => {
      let barcode = barcodeData.text;

      // const loading = await this.loadingController.create({
      //   // message: '<ion-img src="/assets/spinner.gif" alt="Loading..."></ion-img>',
      //   // translucent: true,
      //   // showBackdrop: false,
      //   spinner: 'bubbles'
      // });
      // loading.present();
      this.showLoader = true;
  
      this.productService.product_details_by_barcode(barcode).subscribe(async response => {
        // loading.dismiss();
        this.showLoader = false;
        if(response.Result == true) {
          if(response.Data[0].IsActive == 'Y') {
            //--- Get the product id and navigate to offer product details page
            let productId = response.Data[0].ProductID;
            this.router.navigate(['/offerproductdetails', {id: productId, imagePath: this.imagePathFixed}]);
          } else {
            const alert = await this.alertCtrl.create({
              message: 'This product is no more avialble.',
              buttons: ['OK']
            });
            alert.present();
            //this.router.navigate(['/alert']);
          }
        } else {
          const alert = await this.alertCtrl.create({
            message: response.Message,
            buttons: ['OK']
          });
          alert.present();
          //this.router.navigate(['/alert']);
        }
      }, async error => {
        //--- In case of error - dismiss loader and show error message
        // loading.dismiss();
        this.showLoader = false;
        const alert = await this.alertCtrl.create({
          message: 'Internal Error: ' + error,
          buttons: ['OK']
        });
        alert.present();
        //this.router.navigate(['/alert']);
      });

    }).catch(async err => {
      const alert = await this.alertCtrl.create({
        message: "Internal error: " + err,
        buttons: ['OK']
      });
      alert.present();
      //this.router.navigate(['/alert']);
    });
  }

  moveProductDetails(productID) {
    this.router.navigate(['/offerproductdetails', {id: productID, imagePath: this.imagePathFixed}]);
  }

}
