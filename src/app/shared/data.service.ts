import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import { serviceUrl } from './AppConstants';
import 'rxjs/add/operator/map';

@Injectable()
export class DataService {
  result: any;
  isLoggedin: boolean;
  BASE_URL: String = serviceUrl;
  private headers: Headers = new Headers({ 'Content-Type': 'application/json' });
  constructor(private http: Http, private _router: Router) { }
  getUsers() {
    return this.http.get(`${this.BASE_URL}/footer`)
      .map(result => this.result = result.json().items);
  }

  login(credentials): Promise<any> {
    this.isLoggedin = false;
    const creds = 'name=' + credentials.username + '&password=' + credentials.password+'&role=admin';
    let url: string = `${this.BASE_URL}/authenticate`;
    return this.http.post(url, credentials, { headers: this.headers }).toPromise();
  }

  logout() {
    let role = parseInt(localStorage.getItem('role'),10);
    
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('role');
    window.localStorage.removeItem('roleType');
    window.localStorage.removeItem('name');
    window.localStorage.removeItem('userName');
    
    window.localStorage.removeItem('instituteUserName');
    window.localStorage.removeItem('schoolUserName');
    window.localStorage.removeItem('staffUserName');
    window.localStorage.removeItem('studentUserName');
    window.localStorage.removeItem('logo');
    window.localStorage.removeItem('stfSubject');
    window.localStorage.removeItem('studentsCount');
    window.localStorage.removeItem('studentId');
    window.localStorage.removeItem('staffId');
    window.localStorage.removeItem('classID');

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

  removeInstance(instanceId, instanceUrl): Promise<any> {
    let url: string = `${this.BASE_URL}/${instanceUrl}`;
    return this.http.put(url, instanceId, { headers: this.headers }).toPromise();
  }

  resetPassword(passwordInfo): Promise<any> {
    let url: string = `${this.BASE_URL}/${passwordInfo.instanceUrl}`;
    return this.http.put(url, {...passwordInfo}, { headers: this.headers }).toPromise();
  }
  
  changePassword(formInfo): Promise<any> {
    let url: string = `${this.BASE_URL}/changePassword`;
    let insHeaders: Headers = new Headers({ 
      'Content-Type': 'application/json',
      ...formInfo
    });
    return this.http.get(url, { headers: insHeaders }).toPromise();
  }

  getInstitutes(): Promise<any> {
    let url: string = `${this.BASE_URL}/getInstitutes`;
    return this.http.get(url, { headers: this.headers }).toPromise();
  }
  
  instnceAvailStaus(instanceName, endPoint): Promise<any> {
    let url: string = `${this.BASE_URL}/${endPoint}`;
    let insHeaders: Headers = new Headers({ 
      'Content-Type': 'application/json',
      instanceName
    });
    return this.http.get(url, { headers: insHeaders }).toPromise();
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
 
  getRegSchoolsCount(instituteUserName): Promise<any> {
    let url: string = `${this.BASE_URL}/getRegSchoolsCount`;
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
  
  getStudentsListById(requestDetails): Promise<any> {
    let url: string = `${this.BASE_URL}/getStudentsListById`;
    let localHeaders: Headers = new Headers({ 
      'Content-Type': 'application/json', 
      ...requestDetails,
     });
    return this.http.get(url, { headers: localHeaders }).toPromise();
  }
 
  getStaffByClassId(requestDetails): Promise<any> {
    let url: string = `${this.BASE_URL}/getStaffByClassId`;
    let localHeaders: Headers = new Headers({ 
      'Content-Type': 'application/json', 
      ...requestDetails,
     });
    return this.http.get(url, { headers: localHeaders }).toPromise();
  }
  
  removeStudent(stuId): Promise<any> {
    let url: string = `${this.BASE_URL}/removeStudent`;
    return this.http.put(url, stuId, { headers: this.headers }).toPromise();
  }


  addTimelineEvent(timeLine): Promise<any> {
    let url: string = `${this.BASE_URL}/addTimelineEvent`;
    return this.http.post(url, timeLine, { headers: this.headers }).toPromise();
  }
  
  updateTimelineEvent(timeLine): Promise<any> {
    let url: string = `${this.BASE_URL}/updateTimelineEvent`;
    return this.http.post(url, timeLine, { headers: this.headers }).toPromise();
  }
  
  saveTimeTableInfo(timetableInfo): Promise<any> {
    let url: string = `${this.BASE_URL}/saveTimeTableInfo`;
    console.log('timetableInfo in service', timetableInfo)
    return this.http.post(url, timetableInfo, { headers: this.headers }).toPromise();
  }

  getTimelineEvents(requestDetails): Promise<any> {
    let url: string = `${this.BASE_URL}/getTimelineEvents`;
    let localHeaders: Headers = new Headers({ 
      'Content-Type': 'application/json', 
      ...requestDetails,
    });
    return this.http.get(url, { headers: localHeaders }).toPromise();
  }

  applyLeave(leaveInfo): Promise<any> {
    let url: string = `${this.BASE_URL}/applyLeave`;
    return this.http.post(url, leaveInfo, { headers: this.headers }).toPromise();
  }
 
  approveLeave(leaveInfo): Promise<any> {
    let url: string = `${this.BASE_URL}/approveLeave`;
    return this.http.post(url, leaveInfo, { headers: this.headers }).toPromise();
  }
  
  updateLeave(leaveInfo): Promise<any> {
    let url: string = `${this.BASE_URL}/updateLeave`;
    return this.http.post(url, leaveInfo, { headers: this.headers }).toPromise();
  }

  rejectLeave(leaveInfo): Promise<any> {
    let url: string = `${this.BASE_URL}/rejectLeave`;
    return this.http.post(url, leaveInfo, { headers: this.headers }).toPromise();
  }
  
  deleteLeave(leaveInfo): Promise<any> {
    let url: string = `${this.BASE_URL}/deleteLeave`;
    return this.http.post(url, leaveInfo, { headers: this.headers }).toPromise();
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
  
  setGalleryDesc(fromInfo):  Promise<any> {
    let url: string = `${this.BASE_URL}/setGalleryDesc`;
    return this.http.post(url, fromInfo, { headers: this.headers }).toPromise();
  }
  
  removeGalleryItem(galId): Promise<any> {
    let url: string = `${this.BASE_URL}/removeGalleryItem`;
    return this.http.put(url, galId, { headers: this.headers }).toPromise();
  }
 
  addAcadamicSetup(fromInfo):  Promise<any> {
    let url: string = `${this.BASE_URL}/addAcadamicSetup`;
    return this.http.post(url, fromInfo, { headers: this.headers }).toPromise();
  }
  
  addStaffAcadamicSetup(fromInfo):  Promise<any> {
    let url: string = `${this.BASE_URL}/addStaffAcadamicSetup`;
    return this.http.post(url, fromInfo, { headers: this.headers }).toPromise();
  }
  
  addStudentMarks(marksList):  Promise<any> {
    let url: string = `${this.BASE_URL}/addStudentMarks`;
    return this.http.post(url, marksList, { headers: this.headers }).toPromise();
  }
 
  addImageDetails(imageDtls):  Promise<any> {
    let url: string = `${this.BASE_URL}/addImageDetails`;
    return this.http.post(url, imageDtls, { headers: this.headers }).toPromise();
  }
  
  getImageDetails(requestDetails): Promise<any> {
    let url: string = `${this.BASE_URL}/getImageDetails`;
    let localHeaders: Headers = new Headers({ 
      'Content-Type': 'application/json', 
      ...requestDetails,
     });
    return this.http.get(url, { headers: localHeaders }).toPromise();
  }
  
  getMarksList(requestDetails): Promise<any> {
    let url: string = `${this.BASE_URL}/getMarksList`;
    let localHeaders: Headers = new Headers({ 
      'Content-Type': 'application/json', 
      ...requestDetails,
     });
    return this.http.get(url, { headers: localHeaders }).toPromise();
  }

  getGalleryList(requestDetails): Promise<any> {
    let url: string = `${this.BASE_URL}/getGalleryList`;
    let localHeaders: Headers = new Headers({ 
      'Content-Type': 'application/json', 
      ...requestDetails,
     });
    return this.http.get(url, { headers: localHeaders }).toPromise();
  }

  test(): string {
    return 'working';
  }

}
