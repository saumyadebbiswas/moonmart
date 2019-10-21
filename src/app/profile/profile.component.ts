import { Component, OnInit } from '@angular/core';
import { UserService } from '../services';
import { SITE_URL } from '../services/constants';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {

  site_url: string;
  user_details: any = [];
  userId: any;
  user_profile_image: string = "../../assets/images/user-img.png";
  username: string = "";
  email: string = "";
  password: string = "";
  mobile_no: string = "";
  refer_code: string = "";
  dob: string = "";
  showLoader: boolean;
  showErrorAlert: boolean;
  error_message: string;
  showInfoAlert: boolean;
  info_message: string;

  constructor(
    private router: Router,
    private userService: UserService
  ) {
    //--- Redirect to login page if user not log in
    if(this.userService.currentUserValue) {
      console.log('Location: ProfileComponent');

      this.user_details = this.userService.currentUserValue;
      //console.log('Logged user details...', this.user_details);

      if(this.user_details.Data.ID != null) {
        this.userId = this.user_details.Data.ID;
      }
      if(this.user_details.Data.Image != null) {
        this.user_profile_image = this.user_details.Data.Image;
      }

      this.site_url = SITE_URL;
    } else {			 
      this.router.navigate(['/login']);
    }
  }

  ngOnInit() {}

  hideErrorAlert() {
    this.showErrorAlert = false;
  }

  hideInfoAlert() {
    this.showInfoAlert = false;
  }

  ionViewWillEnter() {
    this.showLoader = true;

    this.userService.edit_profile(this.userId).subscribe(response => {
      console.log('User details...', response);
      //--- After getting value - dismiss loader
      this.showLoader = false;
      if(response.Result == true) {
        this.username = response.Data.UserName;
        this.email = response.Data.EmailID;
        this.password = response.Data.Password;
        this.mobile_no = response.Data.MobileNumber;
        this.refer_code = response.Data.ReferralCode;
        this.dob = response.Data.DateofBirth;
      } else {
        this.showErrorAlert = true;
        this.error_message = 'No record found!';
      }
    }, error => {
      //--- In case of error - dismiss loader and show error message
      this.showErrorAlert = true;
      this.error_message = 'Internal Error!';
    });
  }

  onSubmit() {

    var mail_format = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    var phone_num_format = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;

    //--- Check empty credentials
    if(this.password.length == 0 || this.mobile_no.length == 0 || this.dob.length == 0) {

      this.showErrorAlert = true;
      this.error_message = 'Enter full credentials!';

    } 
    // else if(!mail_format.test(this.email)) {

    //   this.showErrorAlert = true;
    //   this.error_message = 'Invalid email format!';

    // } 
    else if(!phone_num_format.test(this.mobile_no)) {

      this.showErrorAlert = true;
      this.error_message = 'Invalid mobile format!';

    } else {
      this.showLoader = true;

      let sendData = {
        ID: this.userId,
        UserName: this.username,
        EmailID: this.email,
        Password: this.password,
        MobileNumber: this.mobile_no,
        ReferralCode: this.refer_code,
        DateofBirth: this.dob
      }
      //console.log('Profile send data...', sendData);

      this.userService.update_profile(sendData).subscribe(response => {
        //--- After successful update - dismiss loader and show success message
        this.showLoader = false;
        if(response.Result == true) {
          this.showInfoAlert = true;
          this.info_message = 'Profile updated successfully!';
        } else {
          this.showErrorAlert = true;
          this.error_message = 'Unable to update profile!';
        }
      }, error => {
        //--- In case of error - dismiss loader and show error message
        this.showLoader = false;
        this.showErrorAlert = true;
        this.error_message = 'Internal problem!';
      });
    }
  }

}
