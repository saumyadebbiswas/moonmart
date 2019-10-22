import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, Events, IonSlides } from '@ionic/angular';
import { UserService, CategoryService, ProductService } from '../services';
import { SITE_URL } from '../services/constants';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  site_url: string;
  offers: any = [];
  catrgories: any = [];
  no_of_notification: number = 0;
  bg_color: any = [
    {color: 'blue'},
    {color: 'yellow'},
    {color: 'pink'},
    {color: 'brown'},
    {color: 'green'},
    {color: 'gray'},
    {color: 'purple'},
    {color: 'blue'}];
  showLoader: boolean;
  showErrorAlert: boolean;
  error_message: string;
  showInfoAlert: boolean;
  info_message: string;

  slideOptions = {
    initialSlide: 1,
    speed: 400,
  };

  constructor(
    public menuCtrl: MenuController,
    private userService: UserService,
    private categoryService: CategoryService,
    private productService: ProductService,
    private router: Router,
    private events: Events
  ) {
    //--- Redirect to login page if user not log in
    if(this.userService.currentUserValue){
      console.log('Location: HomePage');

      //this.menuCtrl.enable(true);
      this.site_url = SITE_URL;
    } else {			 
      this.router.navigate(['/login']);			  
    }
  }

  @ViewChild('slider', null) Slides: IonSlides;

  ionViewDidEnter() {
    // console.log('ionViewDidEnter...', this.Slides);
    this.Slides.startAutoplay();
  }
  
  ionViewWillLeave(){
    this.Slides.stopAutoplay();
  }
  
  slidesDidLoad() {
    // console.log('slidesDidLoad...');
    this.Slides.startAutoplay();
  }

  hideErrorAlert() {
    this.showErrorAlert = false;
  }

  hideInfoAlert() {
    this.showInfoAlert = false;
  }

  ngOnInit() {}

  ionViewWillEnter() {

    this.offers = [];
    this.showLoader = true;

    this.productService.offer_List().subscribe(response => {
      //--- After getting value - dismiss loader
      // loading1.dismiss();
      this.showLoader = false;
      if(response.Result == true) {
        this.no_of_notification = response.Data.length;
        response.Data.forEach(element => {
          if(element.IsActive == 'Y') {
            this.offers.push({ID: element.ID, ImgPathUrl: this.site_url + element.ImgPath, ImgPath: element.ImgPath});
          }
        });

        if(this.offers.length == 0) {
          this.offers.push({ID: 0, ImgPathUrl: "/assets/images/slider.png", ImgPath: ""});
        }
        // console.log('Home offers list...', this.offers);
      } else {
        this.offers.push({ID: 0, ImgPathUrl: "/assets/images/slider.png", ImgPath: ""});
        console.log('Home offers empty: ', response.Message);
      }
    }, async error => {
      //--- In case of error - dismiss loader and show error message
      // loading1.dismiss();
      this.showLoader = false;
      this.offers.push({ID: 0, ImgPathUrl: "/assets/images/slider.png", ImgPath: ""});
      console.log('Home offers list error: ', error);
    });

    this.showLoader = true;

    this.categoryService.category_list_all().subscribe(response => {
      //--- After getting value - dismiss loader
      // loading.dismiss();
      this.showLoader = false;
      if(response.Result == true) {
        this.catrgories = response.Data;
        //console.log('Home categories list...', this.catrgories);
      } else {
        this.showInfoAlert = true;
        this.info_message = response.Message;
      }
    }, error => {
      //--- In case of error - dismiss loader and show error message
      // loading.dismiss();
      this.showLoader = false;
      this.showErrorAlert = true;
      this.error_message = "Internal problem!";
    });
  }

  moveProductList( CategoryID ) {
    this.router.navigate(['/productlist', {type: 'ID', value: CategoryID}]);
  }

  moveOfferProductList(offerID, imagePath) {
    //console.log('Home banner click...', offerID, imagePath);
    if(offerID != null && offerID != 0) {
      this.router.navigate(['/offerproducts', {type: 'ID', value: offerID, imagePath: imagePath}]);
    }
  }

}
