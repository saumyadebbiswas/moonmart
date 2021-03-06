import { Component, OnInit, ViewChild } from '@angular/core';
import { BarcodeScannerOptions, BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService, ProductService } from '../services';
import { SITE_URL } from '../services/constants';
import { IonInfiniteScroll } from '@ionic/angular';

@Component({
  selector: 'app-productlist',
  templateUrl: './productlist.component.html',
  styleUrls: ['./productlist.component.scss'],
})
export class ProductlistComponent implements OnInit {

  @ViewChild(IonInfiniteScroll, null) infiniteScroll: IonInfiniteScroll;

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
  categoryID: any;
  imagePath: string;
  products: any = []; //--- This product list changed in serch time
  products_fixed:any = []; //--- This product list remain fixed even in serch
  cat_image: any = true;
  no_of_notification: number = 0;
  barcodeScannerOptions: BarcodeScannerOptions;
  showLoader: boolean;
  showSpinner: boolean;
  showErrorAlert: boolean;
  error_message: string;
  showInfoAlert: boolean;
  info_message: string;
  navigate_alert: boolean = false;

  maxRecord: number = 5; //--- Maximum value show each pagination
  currentPageIndex: number = 1;
  is_searched: boolean = false;
  latest_products:any = [];

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
      this.categoryID = this.route.snapshot.paramMap.get('value');
    } else {
      this.imagePath = '/assets/images/no-image.jpeg'; //--- Default image [Set no-image-available]
      this.categoryID = null;
    }
    // console.log('Product List category ID...', this.categoryID);
    
    //this.get_Category_Details();
    //this.get_offers();
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
    document.getElementById("mySidenavPL"+this.categoryID).style.width = "0";

    this.products_fixed = [];
    this.products = [];
    this.currentPageIndex = 1;
    this.get_products();
  }

  get_Category_Details() {
    this.showLoader = true;

    this.productService.category_details(this.categoryID).subscribe(response => {
      // console.log('Product list category details response...', response);
      //--- After getting value - dismiss loader
      this.showLoader = false;
      if(response.Result == true) {
        if(response.Data.ImgPath != null) {
          this.imagePath = this.site_url + response.Data.ImgPath;
        } else {
          this.imagePath = '/assets/images/no-image.jpeg'; //--- Default image [Set no-image-available]
          console.log('Product list category details error: Category image is null');
        }
      } else {
        this.imagePath = '/assets/images/no-image.jpeg'; //--- Default image [Set no-image-available]
        console.log('Product list category details error: ', response.Message);
      }
    }, async error => {
      //--- In case of error - dismiss loader and show error message
      this.showLoader = false;
      this.imagePath = '/assets/images/no-image.jpeg'; //--- Default image [Set no-image-available]
      console.log('Product list category details error: ', error);
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

  get_products() {
    this.showLoader = true;

    let sendData = {
      Category: this.categoryID,
      CurrentPageIndex: this.currentPageIndex,
      MaxRecord: this.maxRecord
    }

    this.productService.products_by_categoryID(sendData).subscribe(response => {
      if(response.Result == true) {
        response.Data.Products.forEach(element => {
          this.products_fixed.push(element);
          this.products.push(element);
        });

        //--- Check wheather no of product return is less than maximum record
        if(response.Data.Products.length < this.maxRecord) {
          this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
        }

        this.currentPageIndex += 1;

        //console.log('Product list...', this.products, this.currentPageIndex);

        //this.showLoader = false;
        this.get_Category_Details();
        this.get_offers();
      } else {
        // this.showErrorAlert = true;
        // this.error_message = 'No product found!';
        // this.navigate_alert = true;
        this.showLoader = false;
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

  loadData(event) {
    
    setTimeout(() => {

      this.showSpinner = true;
      
      let sendData = {
        Category: this.categoryID,
        CurrentPageIndex: this.currentPageIndex,
        MaxRecord: this.maxRecord
      }
      
      this.productService.products_by_categoryID(sendData).subscribe(response => {
        if(response.Result == true) {
          response.Data.Products.forEach(element => {
            this.products_fixed.push(element);
            this.products.push(element);
          });
  
          //--- Check wheather no of product return is less than maximum record
          if(response.Data.Products.length < this.maxRecord) {
            this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
          }
  
          this.currentPageIndex += 1;
          console.log('...........', this.products, this.currentPageIndex);
          

          this.showSpinner = false;
        } else {
          this.showSpinner = false;
        }
      }, error => {
        this.showSpinner = false;
      });

      event.target.complete();
    });
  }
  
  searchProduct(event) {
    let search_value = event.target.value;

    if(search_value.length >= 3) {
      this.showSpinner = true;

      if(this.is_searched == false) {
        this.latest_products = this.products;
      }

      this.is_searched = true;
      let search_content:any = [];
      this.products = this.latest_products;

      this.products.forEach(element => {
        let product_name = element.ProductName.toLowerCase();
        search_value = search_value.toLowerCase();

        if(product_name.includes(search_value)) {
          //this.products.push(element);
          search_content.push(element);
        }
      });

      this.products = search_content;
      
      this.showSpinner = false;
      //console.log('Product list after search...', this.products);
    } else {
      if(this.is_searched) {
        this.showSpinner = true;
        this.is_searched = false;

        this.products = [];
        this.products_fixed.forEach(element => {
          this.products.push(element);
        });

        this.showSpinner = false;
      }
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

  openNav() {
    console.log('openNav..........');
    
    document.getElementById("mySidenavPL"+this.categoryID).style.width = "100%";
  }
  
  /* Set the width of the side navigation to 0 */
  closeNav() {
    document.getElementById("mySidenavPL"+this.categoryID).style.width = "0";
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
