import { Component, OnInit, TemplateRef, ElementRef } from '@angular/core';
import { Http } from '@angular/http';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { FormControl, FormGroup, Validators, Form } from '@angular/forms';
import { MyDatePickerModule, IMyDpOptions } from 'mydatepicker';

import { DataService } from '../../shared/data.service';
declare var AdminLTE: any;
const date = new Date();
@Component({
  selector: 'app-staff-management',
  templateUrl: './staff-management.component.html',
  styleUrls: ['./staff-management.component.css']
})
export class StaffManagementComponent implements OnInit {
  public staffList: any;
  public placeholder = 'mm/dd/yyyy';
  public modalRef: BsModalRef;
  public staffForm: FormGroup;
  public staffName: FormControl;
  public userName: FormControl;
  public password: FormControl;
  public photoPath: FormControl;
  public subject: FormControl;
  public staffRole: FormControl;
  public experience: FormControl;
  public gender: FormControl;
  public email: FormControl;
  public mobile: FormControl;
  public image: FormControl;
  public address: FormControl;
  public state: FormControl;
  public city: FormControl;
  public district: FormControl;
  public country: FormControl;
  public error: any;
  constructor(private modalService: BsModalService,
    private eleRef: ElementRef,
    private dataService: DataService,
    private $http: Http) { }

  ngOnInit() {
    AdminLTE.init();
    this.userName = new FormControl('', []);
    this.staffName = new FormControl('', []);
    this.password = new FormControl('', []);
    this.photoPath = new FormControl('', []);
    this.gender = new FormControl('', []);
    this.email = new FormControl('', []);
    this.mobile = new FormControl('', []);
    this.staffRole = new FormControl('', []);
    this.experience = new FormControl('', []);
    this.subject = new FormControl('', []);
    this.image = new FormControl('', []);
    this.address = new FormControl('', []);
    this.state = new FormControl('', []);
    this.city = new FormControl('', []);
    this.district = new FormControl('', []);
    this.country = new FormControl('', []);
    this.formFileds();
  }

  formFileds() {
    this.staffForm = new FormGroup({
      staffName: this.staffName,
      userName: this.userName,
      password: this.password,
      gender: this.gender,
      email: this.email,
      photoPath: this.photoPath,
      staffRole: this.staffRole,
      mobile: this.mobile,
      subject: this.subject,
      experience: this.experience,
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
  public openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { ignoreBackdropClick: true });
  }
  // public saveStaffForm(staffForm) {
  //   if (this.staffForm.valid) {
  //     this.error = '';
  //     this.dataService.saveStaff(this.staffForm.value)
  //       .then((resp) => {
  //         if (resp.json().success) {
  //           this.staffForm.reset();
  //           this.modalRef.hide();
  //           this.getInstitutesList();
  //         } else {
  //           this.error = resp.json().message;
  //         }
  //       })
  //       .catch((err) => {
  //         console.log('Add Inst Err', err);
  //         this.error = err.json().message;
  //       });
  //   }

  // }
}
