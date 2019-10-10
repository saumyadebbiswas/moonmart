import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
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
  name: string = "Mr. User";
  username: string = "";
  email: string = "";
  password: string = "";
  mobile_no: string = "";
  refer_code: string = "";
  dob: string = "";

  constructor(
    public alertCtrl: AlertController,
    public loadingController: LoadingController,
    private router: Router,
    private userService: UserService
  ) {
    //--- Redirect to login page if user not log in
    if(this.userService.currentUserValue) {
      console.log('Location: ProfileList');

      this.user_details = this.userService.currentUserValue;
      //console.log('Logged user details...', this.user_details);

      if(this.user_details.Data.ID != null) {
        this.userId = this.user_details.Data.ID;
      }
      if(this.user_details.Data.Image != null) {
        this.user_profile_image = this.user_details.Data.Image;
      }
      if(this.user_details.Name != null) {
        this.name = this.user_details.Name;
      }

      this.site_url = SITE_URL;
    } else {			 
      this.router.navigate(['/login']);
    }
  }

  ngOnInit() {}

  async ionViewWillEnter() {
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    loading.present();

    this.userService.edit_profile(this.userId).subscribe(async response => {
      //--- After getting value - dismiss loader
      loading.dismiss();
      if(response.Result == true) {
        this.username = response.Data.UserName;
        this.email = response.Data.EmailID;
        this.password = response.Data.Password;
        this.mobile_no = response.Data.MobileNumber;
        this.refer_code = response.Data.ReferralCode;
        this.dob = response.Data.DateofBirth;
        //console.log('User details...', response);
      } else {
        const alert = await this.alertCtrl.create({
          message: response.Message,
          buttons: ['OK']
        });
        alert.present();
      }
    }, async error => {
      //--- In case of error - dismiss loader and show error message
      loading.dismiss();
      const alert = await this.alertCtrl.create({
        message: 'Internal Error! Unable to load your details.',
        buttons: ['OK']
      });
      alert.present();
    });
  }

  async onSubmit() {

    //--- Check empty credentials
    if(this.username.length == 0 || this.email.length == 0 || this.password.length == 0 || this.mobile_no.length == 0 || this.dob.length == 0) {

      const alert = await this.alertCtrl.create({
        message: 'Enter full credentials!',
        buttons: ['OK']
      });
      alert.present();

    } else {

      //--- Start loader
      const loading = await this.loadingController.create({
        message: 'Please wait...'
      });
      loading.present();

      //--- Get only date 'yyyy-mm-dd', remove time [Not require now]
      // if(this.dob != null){
      //   let date_split = this.dob.split('T');
      //   this.dob = date_split[0];
      //   //console.log('Registration dob date......', this.dob);
      // }

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

      this.userService.update_profile(sendData).subscribe(async response => {
        //--- After successful update - dismiss loader and show success message
        loading.dismiss();
        if(response.Result == true) {
          //console.log('Update response...', response);
          const alert = await this.alertCtrl.create({
            message: "Updated successfully!",
            buttons: ['OK']
          });
          alert.present();
        } else {
          const alert = await this.alertCtrl.create({
            message: response.Message,
            buttons: ['OK']
          });
          alert.present();
        }
      }, async error => {
        //--- In case of error - dismiss loader and show error message
        loading.dismiss();
        const alert = await this.alertCtrl.create({
          message: error.message,
          buttons: ['OK']
        });
        alert.present();
      });
    }
  }

}
