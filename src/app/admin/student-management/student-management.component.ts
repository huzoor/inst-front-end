import { Component, OnInit, TemplateRef, ElementRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MyDatePickerModule, IMyDpOptions } from 'mydatepicker';
import { DataService } from '../../shared/data.service';

declare var AdminLTE: any;
@Component({
  selector: 'app-student-management',
  templateUrl: './student-management.component.html',
  styleUrls: ['./student-management.component.css']
})
export class StudentManagementComponent implements OnInit {
  public placeholder = 'mm/dd/yyyy';
  public studentList: any;
  public modalRef: BsModalRef;
  public studentForm: FormGroup;
  public studentName: FormControl;
  public className: FormControl;
  public studentPhoto: FormControl;
  public dob: FormControl;
  public address: FormControl;
  public rollNumber: FormControl;
  public state: FormControl;
  public city: FormControl;
  public fatherName: FormControl;
  public district: FormControl;
  public country: FormControl;
  public motherName: FormControl;
  public gender: FormControl;
  public email: FormControl;
  public mobile: FormControl;
  public error: any;
  constructor(private modalService: BsModalService,
    private eleRef: ElementRef,
    private dataService: DataService) { }

  ngOnInit() {
    AdminLTE.init();
    this.studentName = new FormControl('', []);
    this.studentPhoto = new FormControl('', []);
    this.dob = new FormControl('', []);
    this.address = new FormControl('', []);
    this.rollNumber = new FormControl('', []);
    this.state = new FormControl('', []);
    this.city = new FormControl('', []);
    this.className = new FormControl('', []);
    this.district = new FormControl('', []);
    this.country = new FormControl('', []);
    this.fatherName = new FormControl('', []);
    this.motherName = new FormControl('', []);
    this.gender = new FormControl('', []);
    this.email = new FormControl('', []);
    this.mobile = new FormControl('', []);
    this.formFileds();

    this.getStudentList();
  }
  getStudentList() {
    // this.dataService.getStudentList(this.studentForm.value)
    //   .then((resp) => {
    //     if (resp.json().success) {
    //       this.studentList = resp.json().schools;
    //     } else {
    //       this.error = 'schools loading failed..!';
    //     }
    //   });
  }

  formFileds() {
    this.studentForm = new FormGroup({
      studentName: this.studentName,
      studentPhoto: this.studentPhoto,
      dob: this.dob,
      address: this.address,
      rollNumber: this.rollNumber,
      state: this.state,
      city: this.city,
      district: this.district,
      country: this.country,
      className: this.className,
      fatherName: this.fatherName,
      motherName: this.motherName,
      gender: this.gender,
      email: this.email,
      mobile: this.mobile
    });
  }

  public openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { ignoreBackdropClick: true });
  }

  public onSubmit(studentForm) {
    // if (this.studentForm.valid) {
    //   this.error = '';
    //   this.dataService.addStudent(this.studentForm.value)
    //     .then((resp) => {
    //       if (resp.json().success) {
    //         this.studentForm.reset();
    //         this.modalRef.hide();
    //         this.getStudentList();
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