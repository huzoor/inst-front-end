import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';

@Injectable()
export class DataService {
  result: any;
  isLoggedin: boolean;
  BASE_URL: String = 'http://localhost:26666/api';
  private headers: Headers = new Headers({ 'Content-Type': 'application/json' });
  constructor(private http: Http, private _router: Router) { }
  getUsers() {
    return this.http.get(`${this.BASE_URL}/footer`)
      .map(result => this.result = result.json().items);
  }

  login(credentials): Promise<any> {
    this.isLoggedin = false;
    const creds = 'name=' + credentials.username + '&password=' + credentials.password;
    let url: string = `${this.BASE_URL}/authenticate`;
    return this.http.post(url, credentials, { headers: this.headers }).toPromise();
  }

  logout() {
    window.localStorage.removeItem('token');
    this.isLoggedin = false;
    this._router.navigate(['/signin']);
  }

  register(user): Promise<any> {
    let url: string = `${this.BASE_URL}/register`;
    return this.http.post(url, user, { headers: this.headers }).toPromise();
  }

  ensureAuthenticated(token): Promise<any> {
    let url: string = `${this.BASE_URL}/status`;
    let headers: Headers = new Headers({
      'Content-Type': 'application/json',
      'x-access-token': token
    });
    return this.http.get(url, { headers: headers }).toPromise();
  }

  addInstitute(institute): Promise<any> {
    let url: string = `${this.BASE_URL}/addInstitute`;
    return this.http.post(url, institute, { headers: this.headers }).toPromise();
  }

  getInstitutes(): Promise<any> {
    let url: string = `${this.BASE_URL}/getInstitutes`;
    return this.http.get(url, { headers: this.headers }).toPromise();
  }

  addSchool(school): Promise<any> {
    let url: string = `${this.BASE_URL}/addSchool`;
    return this.http.post(url, school, { headers: this.headers }).toPromise();
  }

  addStaff(staff): Promise<any> {
    let url: string = `${this.BASE_URL}/addStaff`;
    return this.http.post(url, staff, { headers: this.headers }).toPromise();
  }

  getStaffList(): Promise<any> {
    let url: string = `${this.BASE_URL}/getStaffList`;
    let staffHeaders: Headers = new Headers({ 'Content-Type': 'application/json', 'schoolUserName':'sch1-SCH' });
    return this.http.get(url, { headers: staffHeaders }).toPromise();
  }

  addClass(claasForm): Promise<any> {
    let url: string = `${this.BASE_URL}/addClass`;
    return this.http.post(url, claasForm, { headers: this.headers }).toPromise();
  }
  
  addSubject(subjects): Promise<any> {
    let url: string = `${this.BASE_URL}/addSubject`;
    return this.http.post(url, subjects, { headers: this.headers }).toPromise();
  }

  getEntitiesList(): Promise<any> {
    let url: string = `${this.BASE_URL}/getAcadamicEntities`;
    let localHeaders: Headers = new Headers({ 'Content-Type': 'application/json', 'userName':'inst1-INST' });
    return this.http.get(url, { headers: localHeaders }).toPromise();
  }


  getSubjectData(): Promise<any> {
    let url: string = `${this.BASE_URL}/addSubjects`;
    return this.http.post(url, { headers: this.headers }).toPromise();
  }

  getSchoolList(institute): Promise<any> {
    let url: string = `${this.BASE_URL}/getSchools`;
    return this.http.get(url, { headers: this.headers }).toPromise();
  }

  addStudent(student): Promise<any> {
    let url: string = `${this.BASE_URL}/addStudent`;
    return this.http.post(url, student, { headers: this.headers }).toPromise();
  }

  getStudentList(requestObj): Promise<any> {
    let url: string = `${this.BASE_URL}/getStudentsList`;
    let localHeaders: Headers = new Headers({ 
      'Content-Type': 'application/json', 
      ...requestObj,
     });
    return this.http.get(url, { headers: localHeaders }).toPromise();
  }

  test(): string {
    return 'working';
  }

}
