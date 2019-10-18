import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { UserService } from '../services';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {

  username: string = "";
  email: string = "";
  password: string = "";
  mobile_no: string = "";
  refer_code: string = "";
  dob: string = "";
  terms_check = false;
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
      console.log('Location: SignupComponent');
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

  ngOnInit() { }

  ckeckBox() {
    if(this.terms_check == true) {
      this.terms_check = false;
    } else {
      this.terms_check = true;
    }
    //console.log('Registration terms check...', this.terms_check);
  }

  onSubmit() {

    var mail_format = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    var phone_num_format = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;

    //--- Check empty credentials
    if(this.username.length == 0 || this.email.length == 0 || this.password.length == 0 || this.mobile_no.length == 0 || this.dob.length == 0) {

      this.showErrorAlert = true;
      this.error_message = "Enter full credentials!";

    } else if(!mail_format.test(this.email)) {

      this.showErrorAlert = true;
      this.error_message = "Invalid email format!";

    } else if(!phone_num_format.test(this.mobile_no)) {

      this.showErrorAlert = true;
      this.error_message = "Invalid mobile format!";


    } else if(this.terms_check == false) {

      this.showErrorAlert = true;
      this.error_message = "Check I agree!";

    } else {

      this.showLoader = true;

      //--- Get only date 'yyyy-mm-dd', remove time [Not require now]
      // if(this.dob != null){
      //   let date_split = this.dob.split('T');
      //   this.dob = date_split[0];
      //   //console.log('Registration dob date......', this.dob);
      // }

      let sendData = {
        UserName: this.username,
        EmailID: this.email,
        Password: this.password,
        MobileNumber: this.mobile_no,
        ReferralCode: this.refer_code,
        DateofBirth: this.dob
      }
      //console.log('Registration send data...', sendData);

      this.userService.register(sendData).subscribe(response => {
        //--- After successful registration - dismiss loader and navigate to login page
        this.showLoader = false;
        if(response.Result == true) {
          //console.log('Register response...', response);
          this.showInfoAlert = true;
          this.info_message = "Registration successful!";
        } else {
          this.showErrorAlert = true;
          this.error_message = response.Message;
        }
      }, error => {
        //--- In case of error - dismiss loader and show error message
        this.showLoader = false;
        this.showErrorAlert = true;
        this.error_message = "Internal problem!";
      });
    }
  }

}
