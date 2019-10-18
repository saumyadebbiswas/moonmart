import { Component, OnInit } from '@angular/core';
import { UserService } from '../services';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-enquiry',
  templateUrl: './enquiry.component.html',
  styleUrls: ['./enquiry.component.scss'],
})
export class EnquiryComponent implements OnInit {

  userId: any;
  user_details: any = [];
  name: string = "";
  email: string = "";
  subject: string = "";
  message: string = "";
  showLoader: boolean;

  constructor(
    public alertCtrl: AlertController,
    public loadingController: LoadingController,
    private router: Router,
    private userService: UserService
  ) {
    //--- Redirect to login page if user not log in
    if(this.userService.currentUserValue) {
      console.log('Location: EnquiryComponent');

      this.user_details = this.userService.currentUserValue;
      //console.log('Logged user details...', this.user_details);

      if(this.user_details.Data.ID != null) {
        this.userId = this.user_details.Data.ID;
      }
    } else {			 
      this.router.navigate(['/login']);
    }
  }

  ngOnInit() {}

  async onSubmit() {

    var mail_format = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    //--- Check empty credentials
    if(this.name.length == 0 || this.email.length == 0 || this.subject.length == 0 || this.message.length == 0) {

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
        ID: this.userId,
        Name: this.name,
        EmailID: this.email,
        Subject: this.subject,
        Message: this.message
      }
      // console.log('Enquiry send data...', sendData);

      this.userService.enquiry(sendData).subscribe(async response => {
        //--- After successful send message - dismiss loader and show success message
        // loading.dismiss();
        this.showLoader = false;
        if(response.Result == true) {
          //console.log('Update response...', response);
          const alert = await this.alertCtrl.create({
            message: "Message send successfully!",
            buttons: ['OK']
          });
          alert.present();
        } else {
          const alert = await this.alertCtrl.create({
            message: "Unable to send message!",
            buttons: ['OK']
          });
          alert.present();
        }
      }, async error => {
        //--- In case of error - dismiss loader and show error message
        // loading.dismiss();
        this.showLoader = false;
        const alert = await this.alertCtrl.create({
          message: "Internal Error! Please try again.",
          buttons: ['OK']
        });
        alert.present();
      });
    }
  }

}
