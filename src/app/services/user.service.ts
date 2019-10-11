import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { User } from '../models/user';
import { API_LINK } from './constants';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  api_url: string;
  requestHeader: any = new HttpHeaders();

	private currentUserSubject: BehaviorSubject<User>;
	public currentUser: Observable<User>;

  constructor( private http: HttpClient ) {
    this.api_url = API_LINK;
    this.requestHeader.append('Content-Type', 'application/json');

    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
		this.currentUser = this.currentUserSubject.asObservable();
  }

	public get currentUserValue(): User {
		return this.currentUserSubject.value;
	}

  login(sendData: any): Observable<any> {
    return this.http.post<any>(this.api_url+'/UserLogin', sendData, {headers: this.requestHeader}).pipe(map(user => { 
      //--- Set current user details in local storage             
			if(user.Result == true) {
				localStorage.setItem('currentUser', JSON.stringify(user));
				this.currentUserSubject.next(user);					
      }
      
			return user;
		}));
  }
	
  register(sendData: any): Observable<any> {
    return this.http.post<any>(this.api_url+'/AddProfile', sendData, {headers: this.requestHeader});
  }
	
  forgot_Password(emailId: any): Observable<any> {
    return this.http.post<any>(this.api_url+'/ForgetPaswword?Eml='+emailId,  {headers: this.requestHeader});
  }
	
  edit_profile(userId: any): Observable<any> {
    return this.http.post<any>(this.api_url+'/EditProfile?ID='+userId,  {headers: this.requestHeader});
  }
	
  update_profile(sendData: any): Observable<any> {
    return this.http.post<any>(this.api_url+'/UpdateProfile', sendData, {headers: this.requestHeader});
  }
	
  enquiry(sendData: any): Observable<any> {
    return this.http.post<any>(this.api_url+'/Enquiry', sendData, {headers: this.requestHeader});
  }

  logout() {
    //--- Remove user from local storage to log user out
    localStorage.removeItem('currentUser');				
    this.currentUserSubject.next(null);
  }
}
