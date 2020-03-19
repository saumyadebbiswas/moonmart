import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonSlides } from '@ionic/angular';
import { UserService, CategoryService, ProductService } from '../services';
import { SITE_URL } from '../services/constants';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

  user_details: any = [];
  user_profile_image: string = "../../assets/images/user-img.png";
  user_username: string = 'Guest';
  public appPages = [
    {
      title: 'Home',
      url: '/dashboard'
    },
    {
      title: 'Privacy Policy',
      url: '/privacypolicy'
    },
    // {
    //   title: 'Terms & Conditions',
    //   url: '/termncondition'
    // },
    {
      title: 'Sign In',
      url: '/login'
    }
  ];

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
    {color: 'purple'}];
  showLoader: boolean;
  showErrorAlert: boolean;
  error_message: string;
  showInfoAlert: boolean;
  info_message: string;
  fill_blank: number = 0;
  fill_blank_array: any = [];

  slideOptions = {
    initialSlide: 1,
    speed: 400,
  };

  constructor(
    private userService: UserService,
    private categoryService: CategoryService,
    private productService: ProductService,
    private router: Router
  ) {
    this.site_url = SITE_URL;
  }

  @ViewChild('slider', null) Slides: IonSlides;

  ionViewDidEnter() {
    this.Slides.startAutoplay();
  }
  
  ionViewWillLeave(){
    this.Slides.stopAutoplay();
  }
  
  slidesDidLoad() {
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

    //--- Redirect to home/dashboard if already logged in
    if(this.userService.currentUserValue) { 
      this.router.navigate(['/home']);
    } else {
      console.log('Location: DashboardComponent');

      document.getElementById("mySidenavDB").style.width = "0";
      this.fill_blank_array = [];
      this.offers = [];
      this.showLoader = true;

      this.productService.offer_List().subscribe(response => {
        //--- After getting value - dismiss loader
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

          this.get_all_category();
          
          // response.Data.forEach(element => {
          //   if(element.IsActive == 'Y') {
          //     this.offers.push({ID: element.ID, ImgPathUrl: this.site_url + element.ImgPath, ImgPath: element.ImgPath});
          //   }
          // });

          // if(this.offers.length == 0) {
          //   this.offers.push({ID: 0, ImgPathUrl: "/assets/images/slider.png", ImgPath: ""});
          // }
          //console.log('Home offers list...', this.offers);
        } else {
          this.offers.push({ID: 0, ImgPathUrl: "/assets/images/slider.png", ImgPath: ""});
          console.log('Home offers empty: ', response.Message);
          this.get_all_category();
        }
      }, async error => {
        //--- In case of error - dismiss loader and show error message
        this.showLoader = false;
        this.offers.push({ID: 0, ImgPathUrl: "/assets/images/slider.png", ImgPath: ""});
        console.log('Home offers list error: ', error);
        this.get_all_category();
      });
    }
  }

  get_all_category() {
    this.showLoader = true;

    this.categoryService.category_list_all().subscribe(response => {
      if(response.Result == true) {
        this.catrgories = response.Data;

        if(this.catrgories.length > 0) {
          this.fill_blank = 3 - (this.catrgories.length % 3);

          for(let i = 0; i < this.fill_blank; i++){
            this.fill_blank_array.push(i);
          }
        }
        //--- After getting value - dismiss loader
        this.showLoader = false;
        
        //console.log('Home categories list...', this.catrgories);
      } else {
        //--- After getting value - dismiss loader
        this.showLoader = false;
        
        this.showInfoAlert = true;
        this.info_message = response.Message;
      }
    }, error => {
      //--- In case of error - dismiss loader and show error message
      this.showLoader = false;
      this.showErrorAlert = true;
      this.error_message = "Internal problem!";
    });
  }

  moveSignIn() {
    this.router.navigate(['/login']);
  }

  openNav() {
    document.getElementById("mySidenavDB").style.width = "100%";
  }
  
  /* Set the width of the side navigation to 0 */
  closeNav() {
    document.getElementById("mySidenavDB").style.width = "0";
  }

  movePage( pageURL ) {
    // console.log('Page URL...', pageURL);
    this.router.navigate([pageURL]);
  }

}
