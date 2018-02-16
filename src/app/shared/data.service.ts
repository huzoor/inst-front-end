import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';

@Injectable()
export class DataService {
  result:any;
  isLoggedin: boolean;
  BASE_URL: String = 'http://localhost:26666/api';
  private headers: Headers = new Headers({'Content-Type': 'application/json'});
  constructor(private http: Http,  private _router: Router) { }
  getUsers() {
    return this.http.get(`${this.BASE_URL}/footer`)
      .map(result => this.result = result.json().items);
  }

  login(credentials): Promise<any> {
    this.isLoggedin = false;
    const creds = 'name=' + credentials.username + '&password=' + credentials.password;
    let url: string = `${this.BASE_URL}/authenticate`;
    return this.http.post(url, credentials, {headers: this.headers}).toPromise();
  }

  logout(){
    window.localStorage.removeItem('token');
    this.isLoggedin = false;
    this._router.navigate(['/signin']);
  }

  register(user): Promise<any> {
    let url: string = `${this.BASE_URL}/register`;
    return this.http.post(url, user, {headers: this.headers}).toPromise();
  }

  ensureAuthenticated(token): Promise<any> {
    let url: string = `${this.BASE_URL}/status`;
    let headers: Headers = new Headers({
      'Content-Type': 'application/json',
      'x-access-token': token
    });
    return this.http.get(url, {headers: headers}).toPromise();
  }

  addInstitute(institute): Promise<any> {
    let url: string = `${this.BASE_URL}/addInstitute`;
    return this.http.post(url, institute, {headers: this.headers}).toPromise();
  }
  
  getInstitutes(institute): Promise<any> {
    let url: string = `${this.BASE_URL}/getInstitutes`;
    return this.http.get(url, {headers: this.headers}).toPromise();
  }


  test(): string {
    return 'working';
  }

}
