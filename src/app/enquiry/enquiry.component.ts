import { Component, OnInit } from '@angular/core';
import { UserService } from '../services';
import { Router } from '@angular/router';

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

  hideErrorAlert() {
    this.showErrorAlert = false;
  }

  hideInfoAlert() {
    this.showInfoAlert = false;
  }

  onSubmit() {

    var mail_format = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    //--- Check empty credentials
    if(this.name.length == 0 || this.email.length == 0 || this.subject.length == 0 || this.message.length == 0) {
      this.showErrorAlert = true;
      this.error_message = "Enter full credentials!";

    } else if(!mail_format.test(this.email)) {

      this.showErrorAlert = true;
      this.error_message = "Invalid email format!";

    } else {

      this.showLoader = true;

      let sendData = {
        ID: this.userId,
        Name: this.name,
        EmailID: this.email,
        Subject: this.subject,
        Message: this.message
      }
      // console.log('Enquiry send data...', sendData);

      this.userService.enquiry(sendData).subscribe(response => {
        //--- After successful send message - dismiss loader and show success message
        this.showLoader = false;
        if(response.Result == true) {
          // console.log('Update response...', response);
          this.showInfoAlert = true;
          this.info_message = "Message send successfully!";
        } else {
          this.showErrorAlert = true;
          this.error_message = "Unable to send message!";
        }
      }, error => {
        //--- In case of error - dismiss loader and show error message
        this.showLoader = false;
        this.showErrorAlert = true;
        this.error_message = "Internal problem!";
      });
    }
  }

}
