import { Component, OnInit, TemplateRef, ElementRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
  public modalRef: BsModalRef;
  public staffForm: FormGroup;
  public placeholder = 'mm/dd/yyyy';
  public userName: FormControl;
  public subject: FormControl;
  public experience: FormControl;
  public gender: FormControl;
  public email: FormControl;
  public mobile: FormControl;
  public image: FormControl;
  public imageError: boolean;
  public address: FormControl;
  public state: FormControl;
  public city: FormControl;
  public district: FormControl;
  public country: FormControl;
  public error: any;
  constructor(private modalService: BsModalService,
      private eleRef: ElementRef,
      private dataService: DataService) { }

  ngOnInit() {
    AdminLTE.init();
    this.userName = new FormControl('', []);
    this.gender = new FormControl('', []);
    this.email = new FormControl('', []);
    this.mobile = new FormControl('', []);
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
  // getInstitutesList() {
  //   this.dataService.getInstitutes(this.staffForm.value)
  //     .then((resp) => {
  //       if (resp.json().success) {
  //         console.log('Inst Loaded ', resp.json().institutes);
  //         this.staffList = resp.json().institutes;
  //       } else {
  //         console.log('Inst Load Failed');
  //         this.error = 'Institutes loading failed..!';
  //       }
  //     });
  // }
  formFileds() {
    this.staffForm = new FormGroup({
      userName: this.userName,
      gender: this.gender,
      email: this.email,
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

  public openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { ignoreBackdropClick: true });
  }
  public handleFileInput(data: any): void {
    console.log(data.item(0).name);
  }
  // public onSubmit(staffForm) {
  //   if (this.staffForm.valid) {
  //     this.error = '';
  //     this.dataService.addInstitute(this.staffForm.value)
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
