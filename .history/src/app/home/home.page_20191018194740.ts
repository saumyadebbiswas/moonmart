import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
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

  //--- Configuration for Slider
  // slideOptsOne = {
  //   initialSlide: 0,
  //   slidesPerView: 1,
  //   autoplay:true
  // };
  // isBeginningSlide: any = true;
  // isEndSlide: any = false;

  constructor(
    public menuCtrl: MenuController,
    private userService: UserService,
    private categoryService: CategoryService,
    private productService: ProductService,
    private router: Router
  ) {
    //--- Redirect to login page if user not log in
    if(this.userService.currentUserValue){
      console.log('Location: HomePage');

      this.menuCtrl.enable(true);
      this.site_url = SITE_URL;
    } else {			 
      this.router.navigate(['/login']);			  
    }
  }

  hideErrorAlert() {
    this.showErrorAlert = false;
  }

  hideInfoAlert() {
    this.showInfoAlert = false;
  }

  // //--- Method called when slide is changed by drag or navigation
  // SlideDidChange(object, slideView) {
  //   this.checkIfNavDisabled(object, slideView);
  // }
 
  // //--- Call methods to check if slide is first or last to enable disbale navigation  
  // checkIfNavDisabled(object, slideView) {
  //   this.checkisBeginning(object, slideView);
  //   this.checkisEnd(object, slideView);
  // }
 
  // //--- Check slide begining
  // checkisBeginning(object, slideView) {
  //   slideView.isBeginning().then((istrue) => {
  //     this.isBeginningSlide = istrue;
  //   });
  // }

  // //--- Check slide end
  // checkisEnd(object, slideView) {
  //   slideView.isEnd().then((istrue) => {
  //     this.isEndSlide = istrue;
  //   });
  // }

  ionViewDidEnter() {
    this.offers = [];
    this.showLoader = true;

    this.productService.offer_List().subscribe(response => {
      //--- After getting value - dismiss loader
      // loading1.dismiss();
      this.showLoader = false;
      if(response.Result == true) {
        console.log('responce data :.............', response);
        if(response.Data && response.Data.length > 0){
          response.Data.forEach(element => {
            if(element.IsActive == 'Y') {
              this.offers.push({ID: element.ID, ImgPathUrl: this.site_url + element.ImgPath, ImgPath: element.ImgPath});
            }
          });
        }else{           
            this.offers.push({ID: 0, ImgPathUrl: "/assets/images/slider.png", ImgPath: ""});            
        }
        
        // response.Data.forEach(element => {
        //   if(element.IsActive == 'Y') {
        //     this.offers.push({ID: element.ID, ImgPathUrl: this.site_url + element.ImgPath, ImgPath: element.ImgPath});
        //   }
        // });

        // if(this.offers.length == 0) {
        //   this.offers.push({ID: 0, ImgPathUrl: "/assets/images/slider.png", ImgPath: ""});
        // }
        console.log('Home offers list...', this.offers);
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
