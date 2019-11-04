import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_LINK } from './constants';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  api_url: string;
  requestHeader: any = new HttpHeaders();

  constructor( private http: HttpClient ) {
    this.api_url = API_LINK;
    this.requestHeader.append('Content-Type', 'application/json');
  }
	
  category_details(categoryID: any): Observable<any> {
    return this.http.post<any>(this.api_url+'/EditProductCategory?CategoryID='+categoryID, {headers: this.requestHeader});
  }
  
  // Changed from 04-11-2019
  // products_by_categoryID(categoryID: any): Observable<any> {
  //   return this.http.get<any>(this.api_url+'/ListProductCategorySearch?CategoryID='+categoryID, {headers: this.requestHeader});
  // }
  products_by_categoryID(sendData: any): Observable<any> {
    return this.http.post<any>(this.api_url+'/ListProductCategorySearch', sendData, {headers: this.requestHeader});
  }
	
  product_details(productId: any): Observable<any> {
    return this.http.post<any>(this.api_url+'/EditProduct?ID='+productId, {headers: this.requestHeader});
  }
	
  offer_product_details(productId: any): Observable<any> {
    return this.http.post<any>(this.api_url+'/editOfferProduct?ID='+productId, {headers: this.requestHeader});
  }
	
  product_details_by_barcode(barcode: any): Observable<any> {
    return this.http.get<any>(this.api_url+'/BarcodeSearch?Barcode='+barcode, {headers: this.requestHeader});
  }
	
  offer_List(): Observable<any> {
    return this.http.get<any>(this.api_url+'/ListOffers', {headers: this.requestHeader});
  }
	
  products_by_offerID(offerID: any): Observable<any> {
    return this.http.get<any>(this.api_url+'/ListSpecialOfferProduct?OfferID='+offerID, {headers: this.requestHeader});
  }

}
