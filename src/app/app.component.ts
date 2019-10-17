import { Component } from '@angular/core';
import { Platform, MenuController, Events } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  user_details: any = [];
  user_profile_image: string = "../../assets/images/user-img.png";
  user_username: string;
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

    //--- Get logged cuurent user details in case of page refresh (usually not happen)
    if(this.userService.currentUserValue) {		   
      this.user_details = this.userService.currentUserValue;
      // console.log('Logged user details...', this.user_details);

      if(this.user_details.Data.Image != null) {
        this.user_profile_image = this.user_details.Data.Image;
      }
      if(this.user_details.Data.UserName != null) {
        this.user_username = this.user_details.Data.UserName;
      }
    }

    //--- Get event data set at login time from login page
    events.subscribe('userLogin', (data) => {
      // console.log('Login event data...', data.loggedin);

      //--- Get logged cuurent user details
      if(this.userService.currentUserValue) {		   
        this.user_details = this.userService.currentUserValue;
        // console.log('Logged user details from event...', this.user_details);

        if(this.user_details.Data.Image != null) {
          this.user_profile_image = this.user_details.Data.Image;
        }
        if(this.user_details.Data.UserName != null) {
          this.user_username = this.user_details.Data.UserName;
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

  movePage( pageURL ) {
    // console.log('Page URL...', pageURL);
    this.menuCtrl.close();
    this.router.navigate([pageURL]);
  }

  signOut() {
    this.menuCtrl.close();
    this.menuCtrl.enable(false);
    this.userService.logout();
    this.router.navigate(['/login']);
  }
}
