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

  constructor(
    public menuCtrl: MenuController,
    public alertCtrl: AlertController,
    public loadingController: LoadingController,
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

  async onSubmit() {

    //--- Check empty credentials
    if(this.username.length == 0 || this.password.length == 0) {

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

      let sendData = {
        UserName: this.username,
        Password: this.password
      }

      this.userService.login(sendData).subscribe(async response => {
        //--- After successful login - dismiss loader, enable side menu, navigate to dashboard
        loading.dismiss();
        if(response.Result == true) {
          console.log('Login response...', response);
          //--- Set event data which will access from app component page after login
          this.events.publish('userLogin', {loggedin: true});
          this.menuCtrl.enable(true);
          this.router.navigate(['/home']);
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
