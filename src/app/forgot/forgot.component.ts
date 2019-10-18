import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, MenuController } from '@ionic/angular';
import { UserService } from '../services';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.scss'],
})
export class ForgotComponent implements OnInit {

  email: string = "";
  showLoader: boolean;

  constructor(
    public menuCtrl: MenuController,
    public alertCtrl: AlertController,
    public loadingController: LoadingController,
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

  ngOnInit() {}

  async onSubmit() {

    var mail_format = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    //--- Check empty credentials
    if(this.email.length == 0) {

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

      console.log('Forgot password email data...', this.email);

      this.userService.forgot_Password(this.email).subscribe(async response => {
        //console.log('Forgot password response...', response);
        // loading.dismiss();
        this.showLoader = false;
        if(response.Result == true) {
          const alert = await this.alertCtrl.create({
            message: "New password send to your mail ID.",
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
        //--- In case of login error - dismiss loader, show error message
        // loading.dismiss();
        this.showLoader = false;
        const alert = await this.alertCtrl.create({
          message: error.message,
          buttons: ['OK']
        });
        alert.present();
      });
    }
  }

}
