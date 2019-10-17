import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { UserService, ProductService } from '../services';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit {

  offers: any = [];

  constructor(
    public alertCtrl: AlertController,
    public loadingController: LoadingController,
    private router: Router,
    private userService: UserService,
    private productService: ProductService
  ) {
    //--- Redirect to login page if user not log in
    if(this.userService.currentUserValue){
      console.log('Location: NotificationsComponent');
    } else {			 
      this.router.navigate(['/login']);
    }
  }

  ngOnInit() {}

  async ionViewWillEnter() {
    const loading = await this.loadingController.create({
      message: '<ion-img src="/assets/spinner.gif" alt="Loading..."></ion-img>',
      translucent: true,
      showBackdrop: false,
      spinner: null,
    });
    loading.present();

    this.productService.offer_List().subscribe(async response => {
      //--- After getting value - dismiss loader
      loading.dismiss();
      if(response.Result == true) {
        this.offers = response.Data;
        //console.log('Offers list...', this.offers);
      } else {
        const alert = await this.alertCtrl.create({
          message: response.Message,
          buttons: ['OK']
        });
        alert.present();

        this.router.navigate(['/alert']);
      }
    }, async error => {
      //--- In case of error - dismiss loader and show error message
      loading.dismiss();
      const alert = await this.alertCtrl.create({
        message: 'Internal Error! Unable to load offers.',
        buttons: ['OK']
      });
      alert.present();

      this.router.navigate(['/alert']);
    });
  }

  moveOfferProductList(offerID, imagePath) {
    this.router.navigate(['/offerproducts', {type: 'ID', value: offerID, imagePath: imagePath}]);
  }

}
