import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, Events, MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { UserService } from '../services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  username: string = "";
  password: string = "";
  showLoader: boolean;
  showSucessAlert: boolean;
  error_message: string;

  constructor(
    public menuCtrl: MenuController,
    //public alertCtrl: AlertController,
    //public loadingController: LoadingController,
    private router: Router,
    public events: Events,
    public userService: UserService
  ) {
    //--- Redirect to home/dashboard if already logged in
    if(this.userService.currentUserValue) { 
      this.router.navigate(['/home']);
    } else {
      console.log('Location: LoginComponent');
      this.menuCtrl.enable(false);
    }
  }

  ngOnInit() {}

  hideSucessAlert() {
    this.showSucessAlert = false;
  }

  onSubmit() {

    //--- Check empty credentials
    if(this.username.length == 0 || this.password.length == 0) {

      // const alert = await this.alertCtrl.create({
      //   message: 'Enter full credentials!',
      //   buttons: ['OK']
      // });
      // alert.present();
      this.showSucessAlert = true;
      this.error_message = "Enter full credentials!";

    } else {

      //--- Start loader
      // const loading = await this.loadingController.create({
      //   // message: '<ion-img src="/assets/spinner.gif" alt="Loading..."></ion-img>',
      //   // translucent: true,
      //   // showBackdrop: false,
      //   spinner: 'bubbles'
      // });
      // loading.present();
      this.showLoader = true;

      let sendData = {
        UserName: this.username,
        Password: this.password
      }

      this.userService.login(sendData).subscribe(response => {
        //--- After successful login - dismiss loader, enable side menu, navigate to dashboard
        // loading.dismiss();
        this.showLoader = false;
        if(response.Result == true) {
          console.log('Login response...', response);
          //--- Set event data which will access from app component page after login
          this.events.publish('userLogin', {loggedin: true});
          this.menuCtrl.enable(true);
          this.router.navigate(['/home']);
        } else {
          this.showSucessAlert = true;
          this.error_message = "Enter valid credentials!";
          // const alert = await this.alertCtrl.create({
          //   header: 'Error!',
          //   message: 'Enter valid credentials!',
          //   cssClass: 'custom-alertDanger',
          //   buttons: ['OK']
          // });
          // alert.present();
        }
      }, error => {
        //--- In case of login error - dismiss loader, show error message
        // loading.dismiss();
        this.showLoader = false;
        this.showSucessAlert = true;
        this.error_message = "Internal error: " + error;
        // const alert = await this.alertCtrl.create({
        //   //message: error.message,
        //   message: "Internal error! Please try again.",
        //   buttons: ['OK']
        // });
        // alert.present();
      });
    }
  }

}
