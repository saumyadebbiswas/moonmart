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
  discount: any = null;

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
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    loading.present();

    this.productService.product_details(this.productId).subscribe(async response => {
      if(response.Result == true) {
        if(response.Data.IsActive == 'Y') {
          this.product = response.Data;
          console.log('Product details...', this.product);

          if(this.product.OfferPercentage && this.product.OfferPercentage != 0) {
            this.discount = this.product.OfferPercentage;

            // this.discount = ((this.product.Price - this.product.OfferPrice) / this.product.Price) * 100;

            // //--- Check whether discount is integer or float 
            // if(this.discount % 1 !== 0) {
            //   //--- If float then format it like 1.23456 => 1.23
            //   this.discount = (this.discount).toFixed(2);
            // }
          } else {
            this.discount = null;
          }

          if(this.product.ImgPath != null) {
            this.product_image = response.Data.ImgPath;
          } else {
            this.product_image = '/assets/images/product-detail-img.png';
          }
          
          if(this.product.Category != null) {
            //--- Get all other products under same category as populer products
            this.productService.products_by_categoryID(this.product.Category).subscribe(async response => {
              //--- After getting value - dismiss loader
              loading.dismiss();
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
            loading.dismiss();
            console.log('Product category null...');
          }

        } else {
          loading.dismiss();
          const alert = await this.alertCtrl.create({
            message: 'This product is no more avialble.',
            buttons: ['OK']
          });
          alert.present();

          this.router.navigate(['/alert']);
        }
      } else {
        loading.dismiss();
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

}
