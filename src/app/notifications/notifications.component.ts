import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService, ProductService } from '../services';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit {

  offers: any = [];
  no_of_offers: number = 0;
  showLoader: boolean;
  showErrorAlert: boolean;
  error_message: string;
  info_message: string;

  constructor(
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

  hideErrorAlert() {
    this.showErrorAlert = false;
    this.router.navigate(['/alert']);
  }

  ionViewWillEnter() {
    this.showLoader = true;

    this.productService.offer_List().subscribe(response => {
      //--- After getting value - dismiss loader
      this.showLoader = false;
      if(response.Result == true) {
        this.offers = response.Data;

        if(response.Data) {
          this.no_of_offers = response.Data.length;
        }
        //console.log('Offers list...', this.offers);
      } else {
        this.showErrorAlert = true;
        this.error_message = 'No offer available!';
      }
    }, error => {
      //--- In case of error - dismiss loader and show error message
      this.showLoader = false;
      this.showErrorAlert = true;
      this.error_message = 'Internal Error!';
    });
  }

  moveOfferProductList(offerID, imagePath) {
    this.router.navigate(['/offerproducts', {type: 'ID', value: offerID, imagePath: imagePath}]);
  }

}
