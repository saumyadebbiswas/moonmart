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

    //--- Check empty credentials
    if(this.email.length == 0) {

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

      console.log('Forgot password email data...', this.email);

      //*** Error: Forgot password link not aavilable - saumya 03-10-2019 */
      this.userService.forgot_Password(this.email).subscribe(async response => {
        //console.log('Login response...', response);
        //--- After successful login - dismiss loader, enable side menu, navigate to dashboard
        loading.dismiss();
        if(response.Result == true) {
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
