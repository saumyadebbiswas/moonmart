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
	
  products_by_categoryID(categoryID: any): Observable<any> {
    return this.http.get<any>(this.api_url+'/ListProductCategorySearch?CategoryID='+categoryID, {headers: this.requestHeader});
  }
	
  product_details(productId: any): Observable<any> {
    return this.http.post<any>(this.api_url+'/EditProduct?ID='+productId, {headers: this.requestHeader});
  }
	
  product_details_by_barcode(barcode: any): Observable<any> {
    return this.http.get<any>(this.api_url+'/BarcodeSearch?Barcode='+barcode, {headers: this.requestHeader});
  }
}
