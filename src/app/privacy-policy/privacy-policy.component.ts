import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss'],
})
export class PrivacyPolicyComponent implements OnInit {

  user_profile_image: string = "../../assets/images/user-img.png";
  user_username: string = 'Guest';
  public appPages = [
    {
      title: 'Home',
      url: '/dashboard'
    },
    {
      title: 'Privacy Policy',
      url: '/privacypolicy'
    },
    // {
    //   title: 'Terms & Conditions',
    //   url: '/termncondition'
    // },
    {
      title: 'Sign In',
      url: '/login'
    }
  ];

  constructor(
    private router: Router
  ) {}

  ionViewWillEnter() {
    console.log('Location: PrivacyPolicyComponent');
    document.getElementById("mySidenavPP").style.width = "0";
  }

  ngOnInit() {}

  openNav() {
    document.getElementById("mySidenavPP").style.width = "100%";
  }
  
  /* Set the width of the side navigation to 0 */
  closeNav() {
    document.getElementById("mySidenavPP").style.width = "0";
  }

  movePage( pageURL ) {
    // console.log('Page URL...', pageURL);
    this.router.navigate([pageURL]);
  }

}
