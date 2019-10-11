import { Component } from '@angular/core';
import { Platform, MenuController, Events } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  //showFooter: boolean = false;
  user_details: any = [];
  user_profile_image: string = "../../assets/images/user-img.png";
  user_name: string = "Mr. User";
  user_email: string = "user@domain.com";
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
      title: 'Order Receive',
      url: '/orderreceive',
    },
    {
      title: 'Enquiry',
      url: '/enquiry'
    }
  ];

  constructor(
    public menuCtrl: MenuController,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    public userService: UserService,
    public events: Events
  ) {
    this.initializeApp();

    //--- Removing side menu control from login, register and forgot-password page (Not working properly)
    // router.events.forEach((event) => {   
    //   if(event instanceof NavigationStart) {
    //     if((event['url'] == null) || (event['url'] == '/login') || (event['url'] == '/singup') || (event['url'] == '/forgot')) {
    //       //this.menuCtrl.enable(false); 
    //       console.log('I am disable...');
    //       this.showFooter = false; 
    //     } else {
    //       //this.menuCtrl.enable(true);
    //       console.log('I am enable...');
    //       this.showFooter = true;
    //     }
    //   }
    // });

    //--- Get logged cuurent user details in case of page refresh (usually not happen)
    if(this.userService.currentUserValue) {		   
      this.user_details = this.userService.currentUserValue;
      //console.log('Logged user details...', this.user_details);

      if(this.user_details.Data.Image != null){
        this.user_profile_image = this.user_details.Data.Image;
      }
      if(this.user_details.Name != null){
        this.user_name = this.user_details.Name;
      }
      if(this.user_details.Data.EmailID != null){
        this.user_email = this.user_details.Data.EmailID;
      }
    }

    //--- Get event data set at login time from login page
    events.subscribe('userLogin', (data) => {
      //console.log('event data :.............', data.loggedin);

      //--- Get logged cuurent user details
      if(this.userService.currentUserValue) {		   
        this.user_details = this.userService.currentUserValue;
        //console.log('Logged user details from event...', this.user_details);

        if(this.user_details.Data.Image != null){
          this.user_profile_image = this.user_details.Data.Image;
        }
        if(this.user_details.Name != null){
          this.user_name = this.user_details.Name;
        }
        if(this.user_details.Data.EmailID != null){
          this.user_email = this.user_details.Data.EmailID;
        }
      }
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  ngOnInit() {
    //--- Scroll to top after route change	
    // this.router.events.subscribe((evt) => {
    //   if(!(evt instanceof NavigationEnd)) {
    //     return;
    //   }
    //   window.scrollTo(0, 0);
    // });
  }

  movePage( pageURL ) {
    //console.log('Page URL...', pageURL);
    this.menuCtrl.close();
    this.router.navigate([pageURL]);
  }

  moveHome() {
    this.menuCtrl.close();
    this.router.navigate(['/home']);
  }

  moveNotifications() {
    this.menuCtrl.close();
    this.router.navigate(['/notifications']);
  }

  moveOrderReceive() {
    this.menuCtrl.close();
    this.router.navigate(['/orderreceive']);
  }

  moveEnquiry() {
    this.menuCtrl.close();
    this.router.navigate(['/enquiry']);
  }

  // hideMenu() {
  //   console.log('Menu hides...');
  //   this.menuCtrl.close();
  // }

  signOut() {
    this.menuCtrl.close();
    this.menuCtrl.enable(false);
    this.userService.logout();
    this.router.navigate(['/login']);
  }
}
