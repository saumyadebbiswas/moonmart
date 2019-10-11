import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, MenuController } from '@ionic/angular';
import { UserService, CategoryService } from '../services';
import { SITE_URL } from '../services/constants';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  site_url: string;
  catrgories: any = [];
  bg_color: any = [
    {color: 'blue'},
    {color: 'yellow'},
    {color: 'pink'},
    {color: 'brown'},
    {color: 'green'},
    {color: 'gray'},
    {color: 'purple'},
    {color: 'blue'}];

  constructor(
    public menuCtrl: MenuController,
    public alertCtrl: AlertController,
    public loadingController: LoadingController,
    private userService: UserService,
    private categoryService: CategoryService,
    private router: Router
  ) {
    //--- Redirect to login page if user not log in
    if(this.userService.currentUserValue){
      console.log('Location: HomePage');

      this.menuCtrl.enable(true);
      this.site_url = SITE_URL;
    } else {			 
      this.router.navigate(['/login']);			  
    }
  }

  async ionViewWillEnter() {
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    loading.present();

    this.categoryService.category_list_all().subscribe(async response => {
      //--- After getting value - dismiss loader
      loading.dismiss();
      if(response.Result == true) {
        this.catrgories = response.Data;
        //console.log('Home categories list...', this.catrgories);
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
        message: 'Internal Error! Unable to load categories.',
        buttons: ['OK']
      });
      alert.present();
    });
  }

  moveProductList( CategoryID, imagePath ) {
    this.router.navigate(['/productlist', {type: 'ID', value: CategoryID, imagePath: imagePath}]);
  }

}
