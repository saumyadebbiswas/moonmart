import { Component, OnInit } from '@angular/core';
import { BarcodeScannerOptions, BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService, ProductService } from '../services';
import { SITE_URL } from '../services/constants';

@Component({
  selector: 'app-offerproducts',
  templateUrl: './offerproducts.component.html',
  styleUrls: ['./offerproducts.component.scss'],
})
export class OfferproductsComponent implements OnInit {

  user_details: any = [];
  user_profile_image: string = "../../assets/images/user-img.png";
  user_username: string;
  public appPages = [
    {
      title: 'Home',
      url: '/home'
    },
    {
      title: 'Notifications',
      url: '/notifications'
    },
    {
      title: 'Enquiry',
      url: '/enquiry'
    }
  ];

  site_url: string;
  offerID: any;
  imagePath: string;
  imagePathFixed: string = "";
  products: any = []; //--- This product list changed in serch time
  products_fixed:any = []; //--- This product list remain fixed even in serch
  showOfferImage: any = true;
  no_of_notification: number = 0;
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

      this.user_details = this.userService.currentUserValue;
      // console.log('Logged user details...', this.user_details);

      if(this.user_details.Data.Image != null) {
        this.user_profile_image = this.user_details.Data.Image;
      }
      if(this.user_details.Data.UserName != null) {
        this.user_username = this.user_details.Data.UserName;
      }

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
        this.imagePath = '/assets/images/no-image.jpeg';
      }
    } else {
      this.offerID = null;
    }
    // console.log('Offer product List offer ID...', this.offerID);
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
      this.showOfferImage = false;
    } else {
      this.showOfferImage = true;
    }
  }

  ionViewWillEnter() {

    document.getElementById("mySidenavOP").style.width = "0";

    this.showLoader = true;

    this.productService.products_by_offerID(this.offerID).subscribe(response => {
      //--- After getting value - dismiss loader
      //this.showLoader = false;
      if(response.Result == true) {
        this.products_fixed =  response.Data;
        this.products = response.Data;
        //console.log('Offer product list...', this.products);
        this.get_offers();
      } else {
        // this.showErrorAlert = true;
        // this.error_message = 'No product found!';
        // this.navigate_alert = true;
        this.router.navigate(['/alert']);
      }
    }, async error => {
      //--- In case of error - dismiss loader and show error message
      this.showLoader = false;
      // this.showErrorAlert = true;
      // this.error_message = 'Internal Error!';
      // this.navigate_alert = true;
      this.router.navigate(['/alert']);
    });
  }

  get_offers() {
    this.showLoader = true;

    this.productService.offer_List().subscribe(response => {
      //--- After getting value - dismiss loader
      // loading1.dismiss();
      this.showLoader = false;
      if(response.Result == true) {
        this.no_of_notification = response.Data.length;
        // console.log('Product list no of notification...', no_of_notification);
      } else {
        console.log('Product list response.Result false...');
      }
    }, async error => {
      //--- In case of error - dismiss loader and show error message
      // loading1.dismiss();
      this.showLoader = false;
      console.log('Product list internal problem: ', error);
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
        this.showLoader = false;
        if(response.Result == true) {
          if(response.Data[0].IsActive == 'Y') {
            //--- Get the product id and navigate to offer product details page
            let productId = response.Data[0].ProductID;
            this.router.navigate(['/offerproductdetails', {id: productId, imagePath: this.imagePathFixed}]);
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

    }).catch(err => {
      this.showErrorAlert = true;
      this.error_message = err;
    });
  }

  moveProductDetails(productID) {
    this.router.navigate(['/offerproductdetails', {id: productID, imagePath: this.imagePathFixed}]);
  }

  openNav() {
    document.getElementById("mySidenavOP").style.width = "100%";
  }
  
  /* Set the width of the side navigation to 0 */
  closeNav() {
    document.getElementById("mySidenavOP").style.width = "0";
  }

  movePage( pageURL ) {
    // console.log('Page URL...', pageURL);
    this.router.navigate([pageURL]);
  }

  signOut() {
    this.userService.logout();
    this.router.navigate(['/login']);
  }

}
