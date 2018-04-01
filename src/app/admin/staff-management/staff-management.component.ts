import { Component, OnInit, TemplateRef, ElementRef } from '@angular/core';
import { Http } from '@angular/http';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { FormControl, FormGroup, Validators, Form } from '@angular/forms';
import { MyDatePickerModule, IMyDpOptions } from 'mydatepicker';
import { staffRoles, staffQualifications, countriesList, statesList, districtsList, yearsList } from '../../shared/AppConstants';

import { DataService } from '../../shared/data.service';
declare var AdminLTE: any;
const date = new Date();
@Component({
  selector: 'app-staff-management',
  templateUrl: './staff-management.component.html',
  styleUrls: ['./staff-management.component.css']
})
export class StaffManagementComponent implements OnInit {
  public staffList: Object = {
    teaching: [],
    nonTeching: []
  };
  public placeholder: String = 'mm/dd/yyyy';
  public modalRef: BsModalRef;
  public staffForm: FormGroup;
  public name: FormControl;
  public userName: FormControl;
  public password: FormControl;
  public subject: FormControl;
  public staffRole: FormControl;
  public experience: FormControl;
  public yearOfPassing: FormControl;
  public qualification: FormControl;
  public gender: FormControl;
  public email: FormControl;
  public mobile: FormControl;
  public image: FormControl;
  public address: FormControl;
  public state: FormControl;
  public city: FormControl;
  public district: FormControl;
  public country: FormControl;
  public schoolUserName: String;

  public staffRoles: any = new Array;
  public staffQualifications: any = new Array;
  public subjectsList: any  = new Array;
  public countriesList: any = new Array;
  public statesList: any = new Array;
  public districtsList: any = new Array;
  public yearsList: any = new Array;
  public error: any;
  public showUpdateButton: boolean = false;

  constructor(private modalService: BsModalService,
    private eleRef: ElementRef,
    private dataService: DataService,
    private $http: Http) {
    this.staffRoles = staffRoles;
    this.countriesList = countriesList;
    this.staffQualifications = staffQualifications;
    this.yearsList = yearsList;
  }

  ngOnInit() {
    AdminLTE.init();
    this.userName = new FormControl('', []);
    this.name = new FormControl('', []);
    this.password = new FormControl('', []);
    this.gender = new FormControl('', []);
    this.email = new FormControl('', []);
    this.mobile = new FormControl('', []);
    this.staffRole = new FormControl('', []);
    this.experience = new FormControl('', []);
    this.yearOfPassing = new FormControl('', []);
    this.qualification = new FormControl('', []);
    this.subject = new FormControl('', []);
    this.image = new FormControl('', []);
    this.address = new FormControl('', []);
    this.state = new FormControl('', []);
    this.city = new FormControl('', []);
    this.district = new FormControl('', []);
    this.country = new FormControl('', []);
    
    this.formFileds();
    this.getSubjectsList().then(canLoad => this.getStaffList())    
    
  }

  formFileds() {
    this.staffForm = new FormGroup({
      name: this.name,
      userName: this.userName,
      password: this.password,
      gender: this.gender,
      email: this.email,
      staffRole: this.staffRole,
      mobile: this.mobile,
      subject: this.subject,
      experience: this.experience,
      yearOfPassing: this.yearOfPassing,
      qualification: this.qualification,
      image: this.image,
      address: this.address,
      state: this.state,
      city: this.city,
      district: this.district,
      country: this.country
    });
  }
  public uploadImage(data: any): void {
    console.log(data[0]);
  }
  public createEditStaff(template: TemplateRef<any>, editDetails: any) {
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
    let schoolUserName = 'sch1-SCH';
    let instituteUserName = 'inst1-INST'; 
    this.dataService.getStaffList({schoolUserName, instituteUserName})
      .then((resp) => {
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
          console.log('Staff Load Failed');
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
    return this.subjectsList.filter(i=> i._id == subjId)[0].subjectName;
  }

  public addStaff(staffForm) {
    if (this.staffForm.valid) {
      this.error = '';
      // Get this info from localStorage
      this.staffForm.value.schoolUserName = 'sch1-SCH';
      this.staffForm.value.instituteUserName = 'inst1-INST';
      this.dataService.addStaff(this.staffForm.value)
        .then((resp) => {
          if (resp.json().success) {
            this.staffForm.reset();
            this.modalRef.hide();
            this.getStaffList();
          } else {
            this.error = resp.json().message;
          }
        })
        .catch((err) => {
          console.log('Add Staff Err', err);
          this.error = err.json().message;
        });
    }

  }

  public updateStaff(updateStaff): void {
    console.log(updateStaff.value)
  }

  public getSubjectsList(): Promise<Boolean> {
    // Get instituteUserName from localStorage
    let instituteUserName = 'inst1-INST';
    let entityType ='subjects';

    return this.dataService.getEntitiesList({instituteUserName, entityType })
      .then((resp) => {
        let res = resp.json()
        if (res.success) {
          this.subjectsList = res.Subjects;
          return true;
        } else {
          this.error = resp.json().message;
          return false;
        }
      }).catch((err) => {
        console.log('err',err)
        this.error = err.json().message;
        return false;
      });
  }
 
}
