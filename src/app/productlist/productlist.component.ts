import { Component, OnInit } from '@angular/core';
import { DomController, AlertController, LoadingController } from '@ionic/angular';
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
  showSearchbar: boolean = false;
  categoryID: any;
  imagePath: string = '/assets/images/product-img.png'; //--- Default image [Set no-image-available]
  products: any = []; //--- This product list changed in serch time
  products_fixed:any = []; //--- This product list remain fixed even in serch

  constructor(
    public alertCtrl: AlertController,
    public loadingController: LoadingController,
    private domCtrl: DomController,
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
      this.categoryID = this.route.snapshot.paramMap.get('value');

      //--- Check image path get from URL and merge it with site_url
      if(this.route.snapshot.paramMap.get('imagePath') != null)
        this.imagePath = this.site_url + this.route.snapshot.paramMap.get('imagePath');
    } else {
      this.categoryID = null;
    }
    //console.log('Product List category ID...', this.categoryID);
  }

  async ionViewWillEnter() {
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    loading.present();

    this.productService.products_by_categoryID(this.categoryID).subscribe(async response => {
      //--- After getting value - dismiss loader
      loading.dismiss();
      if(response.Result == true) {
        this.products_fixed =  response.Data;
        this.products = response.Data;
        //console.log('product list...', this.products);
      } else {
        const alert = await this.alertCtrl.create({
          message: response.Message,
          buttons: ['OK']
        });
        alert.present();
      }
    }, async error => {
      //--- In case of error - dismiss loader and show error message
      loading.dismiss();
      const alert = await this.alertCtrl.create({
        message: 'Internal Error! Unable to load products.',
        buttons: ['OK']
      });
      alert.present();
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

  //--- On scroll hide search bar [Not working now]
  private adjustElementOnScroll(ev) {
    if(ev) {
      this.domCtrl.write(() => {
        this.showSearchbar = true;
      });
    }
  }

  moveProductDetails(productID) {
    this.router.navigate(['/productsdetails/'+productID]);
  }

}
