import { Component, OnInit } from '@angular/core';
import { Events } from '@ionic/angular';
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
  showErrorAlert: boolean;
  error_message: string;

  constructor(
    private router: Router,
    public events: Events,
    public userService: UserService
  ) {
    //--- Redirect to home/dashboard if already logged in
    // if(this.userService.currentUserValue) { 
    //   this.router.navigate(['/home']);
    // } else {
    //   console.log('Location: LoginComponent');
    // }
  }
  

  ngOnInit() {}

  ionViewWillEnter() {
    //--- Redirect to home/dashboard if already logged in
    if(this.userService.currentUserValue) { 
      this.router.navigate(['/home']);
    } else {
      console.log('Location: LoginComponent');
    }
  }

  hideErrorAlert() {
    this.showErrorAlert = false;
  }

  onSubmit() {

    //--- Check empty credentials
    if(this.username.length == 0 || this.password.length == 0) {

      this.showErrorAlert = true;
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
        console.log('Login response...', response);
        //--- After successful login - dismiss loader, enable side menu, navigate to dashboard
        this.showLoader = false;
        if(response.Result == true) {
          //--- Set event data which will access from app component page after login
          this.events.publish('userLogin', {loggedin: true});
          this.router.navigate(['/home']);
          // window.location.reload();
          // window.location.href = '/home';
        } else {
          this.showErrorAlert = true;
          this.error_message = "Enter valid credentials!";
        }
      }, error => {
        //--- In case of login error - dismiss loader, show error message
        // loading.dismiss();
        this.showLoader = false;
        this.showErrorAlert = true;
        this.error_message = "Internal problem!";
      });
    }
  }

}
