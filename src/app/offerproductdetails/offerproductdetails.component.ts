import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService, UserService } from '../services';
import { SITE_URL } from '../services/constants';

@Component({
  selector: 'app-offerproductdetails',
  templateUrl: './offerproductdetails.component.html',
  styleUrls: ['./offerproductdetails.component.scss'],
})
export class OfferproductdetailsComponent implements OnInit {

  site_url: string;
  productId: any = null;
  product: any = [];
  populer_products: any = [];
  discount: any = null;
  imagePath: string;
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
      console.log('Location: OfferproductdetailsComponent');

      this.site_url = SITE_URL;
    } else {			 
      this.router.navigate(['/login']);
    }
  }

  ngOnInit() {
    //--- Check parameter type get from URL
    if(this.route.snapshot.paramMap.get('id')) {
      this.productId = this.route.snapshot.paramMap.get('id');
      this.imagePath = this.route.snapshot.paramMap.get('imagePath');
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

    this.productService.offer_product_details(this.productId).subscribe(response => {
      this.showLoader = false;
      if(response.Result == true) {
        if(response.Data.IsActive == 'Y') {
          this.product = response.Data;
          //console.log('Offer product details...', this.product);

          if(this.product.OfferPercentage != 0) {
            this.discount = this.product.OfferPercentage;

            //--- Custom discount calculation
            // this.discount = ((this.product.Price - this.product.OfferPrice) / this.product.Price) * 100;

            // //--- Check whether discount is integer or float 
            // if(this.discount % 1 !== 0) {
            //   //--- If float then format it like 1.23456 => 1.23
            //   this.discount = (this.discount).toFixed(2);
            // }
          } else {
            this.discount = null;
          }
          
          if(this.product.Category != null) {
            this.showLoader = true;
            //--- Get all other products under same category as populer products
            this.productService.products_by_offerID(this.product.OfferName).subscribe(response => {
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
    }, async error => {
      //--- In case of error - dismiss loader and show error message
      this.showLoader = false;
      // this.showErrorAlert = true;
      // this.error_message = 'Internal Error!';
      // this.navigate_alert = true;
      this.router.navigate(['/alert']);
    });
  }

  moveOfferProductDetails(productID) {
    this.router.navigate(['/offerproductdetails', {id: productID, imagePath: this.imagePath}]);
  }

  moveOfferProductList() {
    this.router.navigate(['/offerproducts', {type: 'ID', value: this.product.OfferName, imagePath: this.imagePath}]);
    
  }

}
