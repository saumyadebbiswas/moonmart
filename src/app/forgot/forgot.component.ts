import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { UserService } from '../services';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.scss'],
})
export class ForgotComponent implements OnInit {

  email: string = "";
  showLoader: boolean;
  showErrorAlert: boolean;
  error_message: string;
  showInfoAlert: boolean;
  info_message: string;

  constructor(
    public menuCtrl: MenuController,
    private userService: UserService,
    private router: Router
  ) {
    //--- Redirect to home/dashboard if already logged in
    if(this.userService.currentUserValue) { 
      this.router.navigate(['/home']);
    } else {
      console.log('Location: ForgotComponent');
      this.menuCtrl.enable(false);
    }
  }

  hideErrorAlert() {
    this.showErrorAlert = false;
  }

  hideInfoAlert() {
    this.showInfoAlert = false;
    this.router.navigate(['/login']);
  }

  ngOnInit() {}

  onSubmit() {

    var mail_format = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    //--- Check empty credentials
    if(this.email.length == 0) {

      this.showErrorAlert = true;
      this.error_message = "Enter full credentials!";

    } else if(!mail_format.test(this.email)) {

      this.showErrorAlert = true;
      this.error_message = "Invalid email format!";

    } else {
      this.showLoader = true;

      // console.log('Forgot password email data...', this.email);

      this.userService.forgot_Password(this.email).subscribe(response => {
        //console.log('Forgot password response...', response);
        this.showLoader = false;
        if(response.Result == true) {
          this.showInfoAlert = true;
          this.info_message = "New password send to " + this.email;
        } else {
          this.showErrorAlert = true;
          this.error_message = response.Message;
        }
      }, async error => {
        //--- In case of login error - dismiss loader, show error message
        this.showLoader = false;
        this.showErrorAlert = true;
        this.error_message = "Internal problem!";
      });
    }
  }

}
