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

  getStaffList(inputHeaders): Promise<any> {
    let url: string = `${this.BASE_URL}/getStaffList`;
    let staffHeaders: Headers = new Headers({ 
      'Content-Type': 'application/json',
      ...inputHeaders
    });
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
 
  addNewHour(subjects): Promise<any> {
    let url: string = `${this.BASE_URL}/addNewHour`;
    return this.http.post(url, subjects, { headers: this.headers }).toPromise();
  }

  getEntitiesList(requestDeatils): Promise<any> {
    let url: string;
    if(requestDeatils.entityType == 'classes') url = `${this.BASE_URL}/getClassesList`;
    else url = `${this.BASE_URL}/getSubjectsList`;

    let localHeaders: Headers = new Headers({ 
      'Content-Type': 'application/json', 
      ...requestDeatils
    });
    return this.http.get(url, { headers: localHeaders }).toPromise();
  }

  getSubjectData(): Promise<any> {
    let url: string = `${this.BASE_URL}/addSubjects`;
    return this.http.post(url, { headers: this.headers }).toPromise();
  }
 
  getSchoolList(instituteUserName): Promise<any> {
    let url: string = `${this.BASE_URL}/getSchools`;
    let localHeaders: Headers = new Headers({ 
      'Content-Type': 'application/json', 
      ...instituteUserName,
     });
    return this.http.get(url, { headers: localHeaders }).toPromise();
  }

  addStudent(student): Promise<any> {
    let url: string = `${this.BASE_URL}/addStudent`;
    return this.http.post(url, student, { headers: this.headers }).toPromise();
  }

  getStudentsList(requestDetails): Promise<any> {
    let url: string = `${this.BASE_URL}/getStudentsList`;
    let localHeaders: Headers = new Headers({ 
      'Content-Type': 'application/json', 
      ...requestDetails,
     });
    return this.http.get(url, { headers: localHeaders }).toPromise();
  }

  addTimelineEvent(timeLine): Promise<any> {
    let url: string = `${this.BASE_URL}/addTimelineEvent`;
    return this.http.post(url, timeLine, { headers: this.headers }).toPromise();
  }

  getTimelineEvents(requestDetails): Promise<any> {
    let url: string = `${this.BASE_URL}/getTimelineEvents`;
    let localHeaders: Headers = new Headers({ 
      'Content-Type': 'application/json', 
      ...requestDetails,
    });
    return this.http.get(url, { headers: localHeaders }).toPromise();
  }

  applyLeave(timeLine): Promise<any> {
    let url: string = `${this.BASE_URL}/applyLeave`;
    return this.http.post(url, timeLine, { headers: this.headers }).toPromise();
  }
 

  getleavesList(requestDetails): Promise<any> {
    let url: string = `${this.BASE_URL}/getLeavesList`;
    let localHeaders: Headers = new Headers({ 
      'Content-Type': 'application/json', 
      ...requestDetails,
     });
    return this.http.get(url, { headers: localHeaders }).toPromise();
  }

  addAttendance(fromInfo):  Promise<any> {
    let url: string = `${this.BASE_URL}/addAttendance`;
    return this.http.post(url, fromInfo, { headers: this.headers }).toPromise();
  }

  getAttendance(requestDetails): Promise<any> {
    let url: string = `${this.BASE_URL}/getAttendance`;
    let localHeaders: Headers = new Headers({ 
      'Content-Type': 'application/json', 
      ...requestDetails,
     });
    return this.http.get(url, { headers: localHeaders }).toPromise();
  }

  addExam(fromInfo):  Promise<any> {
    let url: string = `${this.BASE_URL}/addExam`;
    return this.http.post(url, fromInfo, { headers: this.headers }).toPromise();
  }
  

  getExamsList(requestDetails): Promise<any> {
    let url: string = `${this.BASE_URL}/getExamsList`;
    let localHeaders: Headers = new Headers({ 
      'Content-Type': 'application/json', 
      ...requestDetails,
     });
    return this.http.get(url, { headers: localHeaders }).toPromise();
  }

  getHoursList(requestDetails): Promise<any> {
    let url: string = `${this.BASE_URL}/getHoursList`;
    let localHeaders: Headers = new Headers({ 
      'Content-Type': 'application/json', 
      ...requestDetails,
     });
    return this.http.get(url, { headers: localHeaders }).toPromise();
  }

  getExamTypes(requestDetails): Promise<any> {
    let url: string = `${this.BASE_URL}/getExamTypes`;
    let localHeaders: Headers = new Headers({ 
      'Content-Type': 'application/json', 
      ...requestDetails,
     });
    return this.http.get(url, { headers: localHeaders }).toPromise();
  }

  setTimeTable(fromInfo):  Promise<any> {
    let url: string = `${this.BASE_URL}/setTimeTable`;
    return this.http.post(url, fromInfo, { headers: this.headers }).toPromise();
  }

  test(): string {
    return 'working';
  }

}
