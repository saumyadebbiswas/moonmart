import { Component, OnInit } from '@angular/core';
import { BarcodeScannerOptions, BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService, ProductService } from '../services';
import { SITE_URL } from '../services/constants';

@Component({
  selector: 'app-productlist',
  templateUrl: './productlist.component.html',
  styleUrls: ['./productlist.component.scss'],
})
export class ProductlistComponent implements OnInit {

  site_url: string;
  categoryID: any;
  imagePath: string;
  products: any = []; //--- This product list changed in serch time
  products_fixed:any = []; //--- This product list remain fixed even in serch
  cat_image: any = true;
  barcodeScannerOptions: BarcodeScannerOptions;
  showLoader: boolean;
  showErrorAlert: boolean;
  error_message: string;
  showInfoAlert: boolean;
  info_message: string;
  navigate_alert: boolean = false;

  constructor(
    private barcodeScanner: BarcodeScanner,
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
      this.categoryID = this.route.snapshot.paramMap.get('value');

      this.showLoader = true;
  
      this.productService.category_details(this.categoryID).subscribe(response => {
        console.log('Product list category details response...', response);
        //--- After getting value - dismiss loader
        this.showLoader = false;
        if(response.Result == true) {
          if(response.Data.ImgPath != null) {
            this.imagePath = this.site_url + response.Data.ImgPath;
          } else {
            this.imagePath = '/assets/images/product-img.png'; //--- Default image [Set no-image-available]
            console.log('Product list category details error: Category image is null');
          }
        } else {
          this.imagePath = '/assets/images/product-img.png'; //--- Default image [Set no-image-available]
          console.log('Product list category details error: ', response.Message);
        }
      }, async error => {
        //--- In case of error - dismiss loader and show error message
        this.showLoader = false;
        this.imagePath = '/assets/images/product-img.png'; //--- Default image [Set no-image-available]
        console.log('Product list category details error: ', error);
      });
    } else {
      this.imagePath = '/assets/images/product-img.png'; //--- Default image [Set no-image-available]
      this.categoryID = null;
    }
    // console.log('Product List category ID...', this.categoryID);
  }

  hideErrorAlert() {
    this.showErrorAlert = false;

    if(this.navigate_alert) {
      this.router.navigate(['/alert']);
    }
  }

  hideInfoAlert() {
    this.showInfoAlert = false;
  }
 
  logScrolling(event){
    // console.log("logScrolling : When Scrolling", event.detail.currentY);
    let scrollingPos = event.detail.currentY;

    if(scrollingPos > 0) {
      //this.show_search = false;
      this.cat_image = false;
    } else {
      this.cat_image = true;
    }
  }

  ionViewWillEnter() {
    this.showLoader = true;

    this.productService.products_by_categoryID(this.categoryID).subscribe(response => {
      //--- After getting value - dismiss loader
      // loading.dismiss();
      this.showLoader = false;
      if(response.Result == true) {
        this.products_fixed =  response.Data;
        this.products = response.Data;
        //console.log('Product list...', this.products);
      } else {
        // this.showErrorAlert = true;
        // this.error_message = 'No product found!';
        // this.navigate_alert = true;
        this.router.navigate(['/alert']);
      }
    }, error => {
      //--- In case of error - dismiss loader and show error message
      this.showLoader = false;
      // this.showErrorAlert = true;
      // this.error_message = 'Internal Error!';
      // this.navigate_alert = true;
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
            this.showInfoAlert = true;
            this.info_message = 'This product is no more avialble!';
          }
        } else {
          this.showErrorAlert = true;
          this.error_message = "No product found!";
        }
      }, error => {
        //--- In case of error - dismiss loader and show error message
        this.showLoader = false;
        this.showErrorAlert = true;
        this.error_message = 'Internal Error!';
      });

    }).catch(async err => {
      this.showErrorAlert = true;
      this.error_message = err;
    });
  }

  moveProductDetails(productID) {
    this.router.navigate(['/productsdetails/'+productID]);
  }

}
