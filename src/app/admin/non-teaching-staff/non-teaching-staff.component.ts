import { Component, OnInit, TemplateRef, ElementRef } from '@angular/core';
import { Http } from '@angular/http';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { FormControl, FormGroup, Validators, Form } from '@angular/forms';
import { MyDatePickerModule, IMyDpOptions } from 'mydatepicker';
import { staffRoles, staffQualifications, countriesList, statesList, districtsList, yearsList } from '../../shared/AppConstants';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataService } from '../../shared/data.service';
declare var AdminLTE: any;
const date = new Date();
@Component({
  selector: 'app-non-teaching-staff',
  templateUrl: './non-teaching-staff.component.html',
  styleUrls: ['./non-teaching-staff.component.css']
})
export class NonTeachingStaffComponent implements OnInit {
  
  public staffList: Object = {
    teaching: [],
    nonTeching: []
  };
  public placeholder: String = 'mm/dd/yyyy';
  public modalRef: BsModalRef;
  public staffForm: FormGroup;
  public userName: FormControl;
  public staffName: FormControl;
  public subject: FormControl;
  public staffRole: FormControl;
  public experience: FormControl;
  public yearOfPassing: FormControl;
  public qualification: FormControl;
  public gender: FormControl;
  public email: FormControl;
  public mobile: FormControl;
  public address: FormControl;
  public state: FormControl;
  public city: FormControl;
  public district: FormControl;
  public country: FormControl;
  public _id: FormControl;
  public schoolUserName: FormControl;
  public instituteUserName: FormControl;

  public staffRoles: any = new Array;
  public staffQualifications: any = new Array;
  public subjectsList: any  = new Array;
  
  public countriesList: any = countriesList;
  public statesList: any = statesList;
  public districtsList: any = districtsList;
  public yearsList: any = new Array;
  public error: any;
  public disableUserName: boolean = false;
  public stfAvailStaus: String = '';
  public showUpdateButton: boolean = false;
  public deleteStaff: any;

  constructor(private modalService: BsModalService,
    private eleRef: ElementRef,
    private dataService: DataService,
    private $http: Http,
    private loadingIndicator: NgxSpinnerService) {
  }

  ngOnInit() {
    AdminLTE.init();
    this.loadingIndicator.show();
    this.staffRoles = staffRoles;
    this.countriesList = countriesList;
    this.staffQualifications = staffQualifications;
    this.yearsList = yearsList;

    this.staffName = new FormControl('', []);
    this.userName = new FormControl('', []);
    this.gender = new FormControl('', []);
    this.email = new FormControl('', []);
    this.mobile = new FormControl('', []);
    this.staffRole = new FormControl('', []);
    this.experience = new FormControl('', []);
    this.yearOfPassing = new FormControl('', []);
    this.qualification = new FormControl('', []);
    this.subject = new FormControl('', []);
    this.address = new FormControl('', []);
    this.state = new FormControl('', []);
    this.city = new FormControl('', []);
    this.district = new FormControl('', []);
    this.country = new FormControl('', []);
    this._id = new FormControl('', []);
    this.schoolUserName = new FormControl('', []);
    this.instituteUserName = new FormControl('', []);
    
    this.formFileds();
    this.getSubjectsList().then(canLoad => this.getStaffList())    
    
  }

  formFileds() {
    this.staffForm = new FormGroup({
      staffName: this.staffName,
      userName: this.userName,
      gender: this.gender,
      email: this.email,
      staffRole: this.staffRole,
      mobile: this.mobile,
      subject: this.subject,
      experience: this.experience,
      yearOfPassing: this.yearOfPassing,
      qualification: this.qualification,
      address: this.address,
      state: this.state,
      city: this.city,
      district: this.district,
      country: this.country,
      schoolUserName: this.schoolUserName,
      instituteUserName: this.instituteUserName,
      _id: this._id,
    });
  }
  public uploadImage(data: any): void {
    console.log(data[0]);
  }
  public closeMyStaffForm(modalInfo){
    modalInfo.hide();
    this.disableUserName = false;
  }
  public createEditStaff(template: TemplateRef<any>, editDetails: any) {
    this.disableUserName = true;
    this.modalRef = this.modalService.show(template, { ignoreBackdropClick: true });
    console.log(editDetails);
    if (editDetails) {
      this.showUpdateButton = true;
      this.staffForm.setValue(editDetails);
    } else {
      this.showUpdateButton = false;
      this.staffForm.reset();
    }
  }

  public getStaffList() {  
    // get this info from LocalStorage
    let instituteUserName = localStorage.getItem('instituteUserName');
    let schoolUserName = localStorage.getItem('schoolUserName');
     this.dataService.getStaffList({schoolUserName, instituteUserName})
      .then((resp) => {
        this.loadingIndicator.hide();
        if (resp.json().success) {
          this.staffList = {
            teaching: [],
            nonTeching: []
          };
          const staffDetails = resp.json().staffList;
          staffDetails.map((item) => {
            if (item.staffRole === 'teaching') this.staffList['teaching'].push(item);
            else this.staffList['nonTeching'].push(item);
          });
        } else {
          this.loadingIndicator.hide();
          this.error = 'StaffInfo loading failed..!';
        }
      });
  }

  public changeCountry(ctry) {
    this.statesList = statesList.filter((item) => item.countryCode === ctry);
  }

  public changeState(ste) {
    this.districtsList = districtsList.filter((item) => item.stateCode === ste);
  }

  public getSubjectName(subjId) {
    let subjList = this.subjectsList.filter(i=> i._id == subjId);
    return subjList.length > 0 ? subjList[0].subjectName : '';
  }

  public addStaff(staffForm) {
    this.loadingIndicator.show();
    if (this.staffForm.valid) {
      this.error = '';
      // Get this info from localStorage
      this.staffForm.value.schoolUserName = localStorage.getItem('schoolUserName');
      this.staffForm.value.instituteUserName = localStorage.getItem('instituteUserName');
      this.staffForm.value.fromMode = `create`;
      this.dataService.addStaff(this.staffForm.value)
        .then((resp) => {
          this.loadingIndicator.hide();
          if (resp.json().success) {
            this.staffForm.reset();
            this.modalRef.hide();
            this.getStaffList();
          } else {
            this.error = resp.json().message;
          }
        })
        .catch((err) => {
          this.loadingIndicator.hide();
          this.error = err.json().message;
        });
    }

  }

  public updateStaff(updateStaff): void {
    console.log(updateStaff.value);
    this.loadingIndicator.show();
    if (this.staffForm.valid) {
      this.error = '';
      // Get this info from localStorage
      this.staffForm.value.schoolUserName =  localStorage.getItem('schoolUserName');
      this.staffForm.value.instituteUserName =  localStorage.getItem('instituteUserName');
      this.staffForm.value.fromMode = `update`;
      this.dataService.addStaff(this.staffForm.value)
        .then((resp) => {
          this.loadingIndicator.hide();
          if (resp.json().success) {
            this.staffForm.reset();
            this.modalRef.hide();
            this.getStaffList();
          } else {
            this.error = resp.json().message;
          }
        })
        .catch((err) => {
          this.loadingIndicator.hide();
          this.error = err.json().message;
        });
    }
  }

  public getSubjectsList(): Promise<Boolean> {
    // Get instituteUserName from localStorage
    let instituteUserName = localStorage.getItem('instituteUserName');
    let schoolUserName = localStorage.getItem('schoolUserName');
    let entityType ='subjects';

    return this.dataService.getEntitiesList({instituteUserName, schoolUserName, entityType })
      .then((resp) => {
        this.loadingIndicator.hide();
        let res = resp.json()
        if (res.success) {
          this.subjectsList = res.Subjects;
          return true;
        } else {
          this.error = resp.json().message;
          return false;
        }
      }).catch((err) => {
        this.loadingIndicator.hide();
        this.error = err.json().message;
        return false;
      });
  }

  public deleteStaffRecord(template: TemplateRef<any>, deleteData) {
    this.modalRef = this.modalService.show(template, { ignoreBackdropClick: true });
    this.deleteStaff = deleteData;
    console.log(deleteData);
  };

  removeStaff(staffInfo){
    const endPoint = `removeStaff`;
    this.loadingIndicator.show();
    this.modalRef.hide();
    this.dataService.removeInstance({_id: staffInfo._id}, endPoint)
    .then((resp) => {
      this.loadingIndicator.hide();
      if (resp.json().success) {
        this.getStaffList();
      } else {
        this.error = resp.json().message;
      }
    })
    .catch((err) => {
      this.loadingIndicator.hide();
      this.error = err.json().message;
    });
  }

  staffAvailStaus(event){
    const staffName = event.target.value;
    if( staffName !=='undefined'  && staffName.length > 3)
     this.dataService.instnceAvailStaus(staffName, 'stfAvailStaus')
     .then((resp) => {
       
       if (resp.json().success) {
         this.stfAvailStaus = '';
       } else {
         this.stfAvailStaus = resp.json().message;
       }
     })
     .catch((err) => {
       console.log('Avail Stf Err', err);
       this.error = err.json().message;
     });
   }

}

