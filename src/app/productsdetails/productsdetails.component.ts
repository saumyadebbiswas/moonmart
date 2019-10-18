import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService, UserService } from '../services';
import { SITE_URL } from '../services/constants';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-productsdetails',
  templateUrl: './productsdetails.component.html',
  styleUrls: ['./productsdetails.component.scss'],
})
export class ProductsdetailsComponent implements OnInit {

  site_url: string;
  productId: any = null;
  product: any = [];
  product_image: string;
  populer_products: any = [];
  showLoader: boolean;

  constructor(
    public alertCtrl: AlertController,
    public loadingController: LoadingController,
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

  async ionViewWillEnter() {
    this.populer_products = [];
    // const loading = await this.loadingController.create({
    //   // message: '<ion-img src="/assets/spinner.gif" alt="Loading..."></ion-img>',
    //   // translucent: true,
    //   // showBackdrop: false,
    //   spinner: 'bubbles'
    // });
    // loading.present();
    this.showLoader = true;

    this.productService.product_details(this.productId).subscribe(async response => {
      this.showLoader = false;
      if(response.Result == true) {
        if(response.Data.IsActive == 'Y') {
          this.product = response.Data;
          //console.log('Product details...', this.product);

          if(this.product.ImgPath != null) {
            this.product_image = response.Data.ImgPath;
          } else {
            this.product_image = '/assets/images/product-detail-img.png';
          }
          
          if(this.product.Category != null) {
            this.showLoader = true;
            //--- Get all other products under same category as populer products
            this.productService.products_by_categoryID(this.product.Category).subscribe(async response => {
              //--- After getting value - dismiss loader
              // loading.dismiss();
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
                console.log('Product list unavilable...');
              }
            });
          } else {
            //--- If category id not found - dismiss loader
            // loading.dismiss();
            this.showLoader = false;
            console.log('Product category null...');
          }

        } else {
          // loading.dismiss();
          this.showLoader = false;
          const alert = await this.alertCtrl.create({
            message: 'This product is no more avialble.',
            buttons: ['OK']
          });
          alert.present();

          this.router.navigate(['/alert']);
        }
      } else {
        // loading.dismiss();
        this.showLoader = false;
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
        message: 'Internal Error! Unable to load product details.',
        buttons: ['OK']
      });
      alert.present();

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
