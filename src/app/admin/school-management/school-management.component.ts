import { Component, OnInit, TemplateRef, ElementRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MyDatePickerModule, IMyDpOptions } from 'mydatepicker';
import { DataService } from '../../shared/data.service';
import { countriesList, statesList, districtsList }  from '../../shared/AppConstants';

declare var AdminLTE: any;
@Component({
  selector: 'app-school-management',
  templateUrl: './school-management.component.html',
  styleUrls: ['./school-management.component.css']
})
export class SchoolManagementComponent implements OnInit {
  public placeholder = 'mm/dd/yyyy';
  public SchoolsList: any;
  public modalRef: BsModalRef;
  public schoolForm: FormGroup;
  public schoolName: FormControl;
  public selectedLogo: any;
  public imageError: boolean;
  public logo: FormControl;
  public registeredDate: FormControl;
  public schoolAdminName: FormControl;
  public address: FormControl;
  public code: FormControl;
  public state: FormControl;
  public city: FormControl;
  public openingTime: FormControl;
  public closingTime: FormControl;
  public district: FormControl;
  public country: FormControl;
  public userName: FormControl;
  public password: FormControl;
  public email: FormControl;
  public mobile: FormControl;
  public instituteUserName: FormControl;
  public _id: FormControl;

  public countriesList: any = countriesList;
  public statesList: any = statesList;
  public districtsList: any = districtsList;
  public showUpdateButton: boolean = false;
  public error: any;
  constructor(private modalService: BsModalService,
    private eleRef: ElementRef,
    private dataService: DataService) { }

  ngOnInit() {
    AdminLTE.init();
    this.schoolName = new FormControl('', []);
    this.logo = new FormControl('', []);
    this.registeredDate = new FormControl('', []);
    this.address = new FormControl('', []);
    this.code = new FormControl('', []);
    this.state = new FormControl('', []);
    this.city = new FormControl('', []);
    this.openingTime = new FormControl('', []);
    this.closingTime = new FormControl('', []);
    this.district = new FormControl('', []);
    this.country = new FormControl('', []);
    this.schoolAdminName = new FormControl('', []);
    this.userName = new FormControl('', []);
    this.password = new FormControl('', []);
    this.email = new FormControl('', []);
    this.mobile = new FormControl('', []);
    this.instituteUserName = new FormControl('inst1-INST', []);
    this._id = new FormControl('', []);
    this.formFileds();
    this.getSchoolsList();
  }
  getSchoolsList() {

    let instituteUserName = 'inst1-INST';
    this.dataService.getSchoolList({instituteUserName})
      .then((resp) => {
        if (resp.json().success) {
          this.SchoolsList = resp.json().schools;
        } else {
          this.error = 'schools loading failed..!';
        }
      });
  }

  formFileds() {
    this.schoolForm = new FormGroup({
      schoolName: this.schoolName,
      logo: this.logo,
      registeredDate: this.registeredDate,
      address: this.address,
      code: this.code,
      state: this.state,
      city: this.city,
      district: this.district,
      country: this.country,
      openingTime: this.openingTime,
      closingTime: this.closingTime,
      schoolAdminName: this.schoolAdminName,
      userName: this.userName,
      password: this.password,
      email: this.email,
      mobile: this.mobile,
      _id: this._id,
      instituteUserName: this.instituteUserName,
    });
  }

  public changeCountry(ctry) {
    this.statesList = statesList.filter((item) => item.countryCode === ctry);
  }

  public changeState(ste) {
    this.districtsList = districtsList.filter((item) => item.stateCode === ste);
  }

  public createEditForm(template: TemplateRef<any>, editData) {
    this.modalRef = this.modalService.show(template, { ignoreBackdropClick: true });
    if (editData) {
      console.log(editData);
      this.showUpdateButton = true;
      const registeredDt = new Date(editData.registeredDate);
      const splitDate = editData.registeredDate.split('/');
      this.schoolForm.setValue(editData);
      const date = { "date": { "year": registeredDt.getFullYear(), "month": (registeredDt.getMonth()+1), "day": registeredDt.getDate() }, "jsdate": "", "formatted": editData.registeredDate, "epoc": "" }
      this.schoolForm.get('registeredDate').setValue(date);
    } else {
      this.schoolForm.reset();
      this.showUpdateButton = false;
    }
  }

  public saveSchoolForm(schoolForm) {
    if (this.schoolForm.valid) {
      this.error = '';
      this.schoolForm.value.registeredDate = this.schoolForm.value.registeredDate.formatted;
      this.schoolForm.value.formMode = 'cerate';
      this.dataService.addSchool(this.schoolForm.value)
        .then((resp) => {
          if (resp.json().success) {
            this.schoolForm.reset();
            this.modalRef.hide();
            this.getSchoolsList();
          } else {
            this.error = resp.json().message;
          }
        })
        .catch((err) => {
          this.error = err.json().message;
        });
    }
  }

  public updateSchoolForm(schoolForm) {
    this.changeCountry(schoolForm.country);
    this.changeState(schoolForm.state);
    this.schoolForm.get('registeredDate').setValue(schoolForm.value.registeredDate.formatted);
    this.schoolForm.value.formMode = 'update';
    console.log(schoolForm.value);

    if (this.schoolForm.valid) {
      this.error = '';
      this.dataService.addSchool(this.schoolForm.value)
        .then((resp) => {
          if (resp.json().success) {
            this.schoolForm.reset();
            this.modalRef.hide();
            this.getSchoolsList();
          } else {
            this.error = resp.json().message;
          }
        })
        .catch((err) => {
          this.error = err.json().message;
        });
    }
  }
}
