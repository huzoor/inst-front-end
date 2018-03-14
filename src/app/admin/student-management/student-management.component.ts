import { Component, OnInit, TemplateRef, ElementRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MyDatePickerModule, IMyDpOptions } from 'mydatepicker';
import { DataService } from '../../shared/data.service';
import { staffRoles, countriesList, statesList, districtsList } from '../../shared/AppConstants';

declare var AdminLTE: any;
@Component({
  selector: 'app-student-management',
  templateUrl: './student-management.component.html',
  styleUrls: ['./student-management.component.css']
})
export class StudentManagementComponent implements OnInit {
  public modalRef: BsModalRef;
  public studentForm: FormGroup;
  public name: FormControl;
  public classEnrolled: FormControl;
  public schoolUserName: FormControl;
  public instituteUserName: FormControl;
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
  public staffRoles: any[];
  public countriesList: any[];
  public statesList: any[];
  public districtsList: any[];
  public placeholder = 'mm/dd/yyyy';
  public studentList: any[];
  public classList: any[];
  public error: any;
  constructor(private modalService: BsModalService,
    private eleRef: ElementRef,
    private dataService: DataService) { }

  ngOnInit() {
    AdminLTE.init();
    this.staffRoles = staffRoles;
    this.countriesList = countriesList;
    this.name = new FormControl('', []);
    this.schoolUserName = new FormControl('', []);
    this.instituteUserName = new FormControl('', []);
    this.dob = new FormControl('', []);
    this.address = new FormControl('', []);
    this.rollNumber = new FormControl('', []);
    this.state = new FormControl('', []);
    this.city = new FormControl('', []);
    this.classEnrolled = new FormControl('', []);
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
    // get this info from LocalStorage
    let schoolUserName = 'sch1-SCH';
    let instituteUserName = 'inst1-INST';
    this.dataService.getStudentsList({schoolUserName,instituteUserName })
      .then((resp) => {
        if (resp.json().success) this.studentList = resp.json().studentsList;
        else this.error = 'students list loading failed..!';
      });
  }

  formFileds() {
    this.studentForm = new FormGroup({
      name: this.name,
      schoolUserName: this.schoolUserName,
      instituteUserName: this.instituteUserName,
      dob: this.dob,
      address: this.address,
      rollNumber: this.rollNumber,
      state: this.state,
      city: this.city,
      district: this.district,
      country: this.country,
      classEnrolled: this.classEnrolled,
      fatherName: this.fatherName,
      motherName: this.motherName,
      gender: this.gender,
      email: this.email,
      mobile: this.mobile
    });
  }

  getEntitiesList(): Promise<any> {
      // Get instituteUserName from localStorage
      let instituteUserName = 'inst1-INST';
     return this.dataService.getEntitiesList(instituteUserName)
        .then((resp) => {
          if (resp.json().success) {
            this.classList = resp.json().Classes;
            return true;
          } else {
            this.error = resp.json().message;
            return false;
          }
        }).catch((err) => {
          console.log('err',err)
          this.error = err.json().message;
          return false;
        })
  }

  public openModal(template: TemplateRef<any>) {
    this.getEntitiesList().then((canOpenModel)=>{
      if(canOpenModel) 
        this.modalRef = this.modalService.show(template, { ignoreBackdropClick: true });
    })
  }

  public changeCountry(ctry) {
    this.statesList = statesList.filter((item) => item.countryCode === ctry);
  }

  public changeState(ste) {
    this.districtsList = districtsList.filter((item) => item.stateCode === ste);
  }

  public onSubmit(studentForm) {
    // Get this info From local storage
    this.studentForm.value.schoolUserName = 'sch1-SCH';
    this.studentForm.value.instituteUserName = 'inst1-INST';
    this.studentForm.value.dob = this.studentForm.value.dob.formatted;
    console.log(this.studentForm.value);
    if (this.studentForm.valid) {
      this.error = '';
      this.dataService.addStudent(this.studentForm.value)
        .then((resp) => {
          if (resp.json().success) {
            this.studentForm.reset();
            this.modalRef.hide();
            this.getStudentList();
          } else this.error = resp.json().message;
        }).catch((err) => this.error = err.json().message);
    }
  }
}
