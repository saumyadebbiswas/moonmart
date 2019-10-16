import { Component, OnInit } from '@angular/core';
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
  imagePath: string = '/assets/images/product-img.png'; //--- Default image [Set no-image-available]
  products: any = []; //--- This product list changed in serch time
  products_fixed:any = []; //--- This product list remain fixed even in serch
  showOfferImage: any = true;

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
      console.log('Location: ProductlistComponent');

      this.site_url = SITE_URL;
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
      if(this.route.snapshot.paramMap.get('imagePath') != null)
        this.imagePath = this.site_url + this.route.snapshot.paramMap.get('imagePath');
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
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    loading.present();

    this.productService.products_by_offerID(this.offerID).subscribe(async response => {
      //--- After getting value - dismiss loader
      loading.dismiss();
      if(response.Result == true) {
        this.products_fixed =  response.Data;
        this.products = response.Data;
        console.log('Offer product list...', this.products);
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

  moveProductDetails(productID) {
    this.router.navigate(['/productsdetails/'+productID]);
  }

}
