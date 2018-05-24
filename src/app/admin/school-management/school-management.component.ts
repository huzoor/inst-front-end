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
  public imageError: boolean;
  public registeredDate: FormControl;
  public address: FormControl;
  public code: FormControl;
  public state: FormControl;
  public city: FormControl;
  public district: FormControl;
  public country: FormControl;
  public userName: FormControl;
  public email: FormControl;
  public mobile: FormControl;
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
    this.registeredDate = new FormControl('', []);
    this.address = new FormControl('', []);
    this.code = new FormControl('', []);
    this.state = new FormControl('', []);
    this.city = new FormControl('', []);
    this.district = new FormControl('', []);
    this.country = new FormControl('', []);
    this.userName = new FormControl('', []);
    this.email = new FormControl('', []);
    this.mobile = new FormControl('', []);
    this._id = new FormControl('', []);
    this.formFileds();
    this.getSchoolsList();
  }
  getSchoolsList() {
    let instituteUserName = localStorage.getItem('instituteUserName');
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
      registeredDate: this.registeredDate,
      address: this.address,
      code: this.code,
      state: this.state,
      city: this.city,
      district: this.district,
      country: this.country,
      userName: this.userName,
      email: this.email,
      mobile: this.mobile,
      _id: this._id,
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
      let instituteUserName = localStorage.getItem('instituteUserName');
      this.schoolForm.value.registeredDate = this.schoolForm.value.registeredDate.formatted;
      this.schoolForm.value.formMode = 'create';
      this.schoolForm.value.instituteUserName = instituteUserName;
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
    let instituteUserName = localStorage.getItem('instituteUserName');
    this.schoolForm.value.formMode = 'update';
    this.schoolForm.value.instituteUserName = instituteUserName;
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
