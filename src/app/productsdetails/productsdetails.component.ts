import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService, UserService } from '../services';
import { SITE_URL } from '../services/constants';

@Component({
  selector: 'app-productsdetails',
  templateUrl: './productsdetails.component.html',
  styleUrls: ['./productsdetails.component.scss'],
})
export class ProductsdetailsComponent implements OnInit {

  site_url: string;
  productId: any = null;
  product: any = [];
  populer_products: any = [];
  showLoader: boolean;
  showErrorAlert: boolean;
  error_message: string;
  showInfoAlert: boolean;
  info_message: string;
  navigate_alert: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private productService: ProductService
  ) {
    //--- Redirect to login page if user not log in
    if(this.userService.currentUserValue){
      console.log('Location: ProductsdetailsComponent');

      this.site_url = SITE_URL;
    } else {			 
      this.router.navigate(['/login']);
    }
  }

  ngOnInit() {
    //--- Check parameter type get from URL
    if(this.route.snapshot.paramMap.get('id')) {
      this.productId = this.route.snapshot.paramMap.get('id');
    }
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

  ionViewWillEnter() {
    this.populer_products = [];
    this.showLoader = true;

    this.productService.product_details(this.productId).subscribe(response => {
      this.showLoader = false;
      if(response.Result == true) {
        if(response.Data.IsActive == 'Y') {
          this.product = response.Data;
          //console.log('Product details...', this.product);
          
          if(this.product.Category != null) {
            this.showLoader = true;
            //--- Get all other products under same category as populer products
            this.productService.products_by_categoryID(this.product.Category).subscribe(response => {
              //--- After getting value - dismiss loader
              this.showLoader = false;
              if(response.Result == true) {
                //--- Discard the current product from populer products
                response.Data.forEach(element => {
                  //--- Match by product id
                  if(element.ProductID != this.productId) {
                    this.populer_products.push(element);
                  }
                });
                //console.log('Populer products list...', this.populer_products);
              } else {
                this.showLoader = false;
                console.log('Product list unavilable...');
              }
            });
          } else {
            //--- If category id not found - dismiss loader
            this.showLoader = false;
            console.log('Product category null...');
          }

        } else {
          // this.showErrorAlert = true;
          // this.error_message = 'This product is no more available!';
          // this.navigate_alert = true;
          this.router.navigate(['/alert']);
        }
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

  moveProductDetails(productID) {
    this.router.navigate(['/productsdetails/'+productID]);
  }

  moveProductList() {
    this.router.navigate(['/productlist', {type: 'ID', value: this.product.Category}]);
  }

}
