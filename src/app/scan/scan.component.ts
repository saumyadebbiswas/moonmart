import { Component, OnInit } from '@angular/core';
import { BarcodeScannerOptions, BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-scan',
  templateUrl: './scan.component.html',
  styleUrls: ['./scan.component.scss'],
})
export class ScanComponent implements OnInit {
  
  //encodeData: any;
  scannedData: {};
  barcodeScannerOptions: BarcodeScannerOptions;

  constructor(
    private router: Router,
    public alertCtrl: AlertController,
    private barcodeScanner: BarcodeScanner 
  ) {
    //this.encodeData = "https://www.google.com";
    //Options
    this.barcodeScannerOptions = {
      showTorchButton: true,
      showFlipCameraButton: true
    };
  }

  ngOnInit() {}

  ionViewWillEnter() {
    console.log('Barcode scanner enter...');
    
    this.barcodeScanner.scan().then(async barcodeData => {
      //this.scannedData = barcodeData;
      
      const alert = await this.alertCtrl.create({
        message: "Barcode data: " + JSON.stringify(barcodeData),
        buttons: ['OK']
      });
      alert.present();
      this.router.navigate(['/home']);
    }).catch(async err => {
      const alert = await this.alertCtrl.create({
        message: "Internal error: " + err,
        buttons: ['OK']
      });
      alert.present();
      this.router.navigate(['/home']);
    });
  }

}
