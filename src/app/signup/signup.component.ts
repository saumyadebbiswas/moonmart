import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, MenuController } from '@ionic/angular';
import { DatePicker } from '@ionic-native/date-picker/ngx';
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

  constructor(
    public menuCtrl: MenuController,
    public alertCtrl: AlertController,
    public loadingController: LoadingController,
    private userService: UserService,
    private router: Router,
    private datePicker: DatePicker
  ) {
    //--- Redirect to home/dashboard if already logged in
    if(this.userService.currentUserValue) { 
      this.router.navigate(['/home']);
    } else {
      console.log('Location: SignupComponent');
      this.menuCtrl.enable(false);
    }
  }

  ngOnInit() {
    //--- Default date picker show on page load (Not require now)
    // this.datePicker.show({
    //   date: new Date(),
    //   mode: 'date',
    //   androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
    // }).then(
    //   date => console.log('Got date: ', date),
    //   err => console.log('Error occurred while getting date: ', err)
    // );
  }

  ckeckBox() {
    if(this.terms_check == true) {
      this.terms_check = false;
    } else {
      this.terms_check = true;
    }
    //console.log('Registration terms check...', this.terms_check);
  }

  async onSubmit() {

    var mail_format = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    var phone_num_format = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;

    //--- Check empty credentials
    if(this.username.length == 0 || this.email.length == 0 || this.password.length == 0 || this.mobile_no.length == 0 || this.dob.length == 0) {

      const alert = await this.alertCtrl.create({
        message: 'Enter full credentials!',
        buttons: ['OK']
      });
      alert.present();

    } else if(!mail_format.test(this.email)) {

      const alert = await this.alertCtrl.create({
        message: 'Invalid email format!',
        buttons: ['OK']
      });
      alert.present();

    } else if(!phone_num_format.test(this.mobile_no)) {

      const alert = await this.alertCtrl.create({
        message: 'Invalid mobile format!',
        buttons: ['OK']
      });
      alert.present();

    } else if(this.terms_check == false) {

      const alert = await this.alertCtrl.create({
        message: 'Check I agree!',
        buttons: ['OK']
      });
      alert.present();

    } else {

      //--- Start loader
      const loading = await this.loadingController.create({
        // message: '<ion-img src="/assets/spinner.gif" alt="Loading..."></ion-img>',
        // translucent: true,
        // showBackdrop: false,
        spinner: 'bubbles'
      });
      loading.present();

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

      this.userService.register(sendData).subscribe(async response => {
        //--- After successful registration - dismiss loader and navigate to login page
        loading.dismiss();
        if(response.Result == true) {
          //console.log('Register response...', response);
          const alert = await this.alertCtrl.create({
            message: "Registration successful! Please login.",
            buttons: ['OK']
          });
          alert.present();
          
          this.router.navigate(['/login']);
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
