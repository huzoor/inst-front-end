import { Component, OnInit, TemplateRef, ElementRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MyDatePickerModule, IMyDpOptions } from 'mydatepicker';
import { DataService } from '../../shared/data.service';

declare var AdminLTE: any;
@Component({
  selector: 'app-school-management',
  templateUrl: './school-management.component.html',
  styleUrls: ['./school-management.component.css']
})
export class SchoolManagementComponent implements OnInit {
  public placeholder = 'mm/dd/yyyy';
  public schoolInfo: any;
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
    this.formFileds();

  //  this.getSchoolsList();
  }
  // getSchoolsList() {
  //   this.dataService.getSchoolList(this.schoolform.value)
  //     .then((resp) => {
  //       if (resp.json().success) {
  //         this.schoolInfo = resp.json().schools;
  //       } else {
  //         this.error = 'schools loading failed..!';
  //       }
  //     });
  // }

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
      mobile: this.mobile
    });
  }

  public openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { ignoreBackdropClick: true });
  }

  public onSubmit(schoolForm) {
    // if (this.schoolform.valid) {
    //   this.error = '';
    //   this.dataService.saveSchools(this.schoolform.value)
    //     .then((resp) => {
    //       if (resp.json().success) {
    //         this.schoolform.reset();
    //         this.modalRef.hide();
    //         //this.getSchoolsList();
    //       } else {
    //         this.error = resp.json().message;
    //       }
    //     })
    //     .catch((err) => {
    //       this.error = err.json().message;
    //     });
    // }
  }
}
