import { Component, OnInit, TemplateRef, ElementRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MyDatePickerModule, IMyDpOptions } from 'mydatepicker';
import { DataService } from '../../shared/data.service';
import { countriesList, statesList, districtsList, validation } from '../../shared/AppConstants';
import { ToastrService } from 'ngx-toastr';

declare var AdminLTE: any;
@Component({
  selector: 'app-student-management',
  templateUrl: './student-management.component.html',
  styleUrls: ['./student-management.component.css']
})
export class StudentManagementComponent implements OnInit {
  public loadingIndicator: Promise<any>;
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
  public photoPath: FormControl;
  public _id: FormControl;

  public countriesList: any[] = countriesList;
  public statesList: any[] = statesList;
  public districtsList: any[] = districtsList;
  public placeholder = 'mm/dd/yyyy';
  public studentList: any[];
  public classList: any[];
  public error: any;
  public stuAvailStaus: String = '';
  public showUpdateButton: boolean = false;
  public deleteStudent: any;
  public disableButton: boolean = false;
  constructor(private modalService: BsModalService,
    private eleRef: ElementRef,
    private dataService: DataService,
    private toastr: ToastrService) { }

  ngOnInit() {
    AdminLTE.init();
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
    this.email = new FormControl('', Validators.pattern(validation.email));
    this.mobile = new FormControl('', [Validators.minLength(10), Validators.maxLength(10)]);
    this.photoPath = new FormControl('', []);
    this._id = new FormControl('', []);

    this.formFileds();
    this.getClassesList().then((canLoadStudent)=>{
      if(canLoadStudent)  this.getStudentList();
    })

  }
  getStudentList() {
    // get this info from LocalStorage
    let schoolUserName = 'sch1-SCH';
    let instituteUserName = 'inst1-INST';
    this.loadingIndicator = this.dataService.getStudentsList({schoolUserName,instituteUserName })
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
      mobile: this.mobile,
      photoPath: this.photoPath,
      _id: this._id,
    });
  }

  /*
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
  } */

  public getClassesList(): Promise<any> {
    // Get instituteUserName from localStorage
    let instituteUserName = 'inst1-INST';
    let schoolUserName = `sch1-SCH`;
    let entityType ='classes';

    return this.dataService.getEntitiesList({instituteUserName, schoolUserName, entityType })
      .then((resp) => {
        let res = resp.json()
        if (res.success) {
          this.classList = res.Classes;
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

  public createEditStudent(template: TemplateRef<any>, editStudent: any) {
    this.disableButton = false;
     this.modalRef = this.modalService.show(template, { ignoreBackdropClick: true });
     if (editStudent) {
      this.showUpdateButton = true;
      const dobDt = new Date(editStudent.dob);
      const crrDate = { "date": { "year": dobDt.getFullYear(), "month": (dobDt.getMonth()+1), "day": dobDt.getDate() }, "jsdate": "", "formatted": editStudent.dob, "epoc": "" }
      this.studentForm.setValue(editStudent);
      this.studentForm.get('dob').setValue(crrDate);      
     } else {
      this.showUpdateButton = false;
      this.studentForm.reset();
     }
  }

  public changeCountry(ctry) {
    this.statesList = statesList.filter((item) => item.countryCode === ctry);
  }

  public changeState(ste) {
    this.districtsList = districtsList.filter((item) => item.stateCode === ste);
  }
  public getClassName(clsId){

    let clsList = this.classList.filter(i=> i._id == clsId);
    return clsList.length > 0 ? clsList[0].className : '';
    //  return this.classList.filter(i=> i._id == clsId)[0].className;
  }

  public saveStudent(studentForm) {
    this.disableButton = true;
    if (this.studentForm.valid) {
      // Get this info From local storage
    this.studentForm.value.schoolUserName = 'sch1-SCH';
    this.studentForm.value.instituteUserName = 'inst1-INST';
    this.studentForm.value.formMode = `create`;
    this.studentForm.value.dob = this.studentForm.value.dob.formatted;
    this.error = '';
      this.dataService.addStudent(this.studentForm.value)
        .then((resp) => {
          if (resp.json().success) {
            this.studentForm.reset();
            this.modalRef.hide();
            this.getStudentList();
            this.toastr.success('Student added successfully');
          } else this.error = resp.json().message;
        }).catch((err) => {
          this.toastr.error('Unable to add student');
          this.error = err.json().message
        });
    }
  };

  public updateStudent(studentForm) { 
    if (this.studentForm.valid) {
      // Get this info From local storage
    this.studentForm.value.schoolUserName = 'sch1-SCH';
    this.studentForm.value.instituteUserName = 'inst1-INST';
    this.studentForm.value.formMode = `update`;
    this.studentForm.value.dob = this.studentForm.value.dob.formatted;
    this.error = '';

    this.dataService.addStudent(this.studentForm.value)
      .then((resp) => {
        if (resp.json().success) {
          this.studentForm.reset();
          this.modalRef.hide();
          this.getStudentList();
          this.toastr.success('Student updated successfully');
        } else this.error = resp.json().message;
      }).catch((err) => {
        this.toastr.error('Unable to update student');
        this.error = err.json().message
      });
    }
  }

  studentAvailStaus(event){
    const studentName = event.target.value;
    if( studentName !=='undefined'  && studentName.length > 3)
     this.dataService.instnceAvailStaus(studentName, 'stuAvailStaus')
     .then((resp) => {
       if (resp.json().success) {
         this.stuAvailStaus = '';
       } else {
         this.stuAvailStaus = resp.json().message;
       }
     })
     .catch((err) => {
       console.log('Avail Stf Err', err);
       this.error = err.json().message;
     });
   }

  public deleteStudentInfo(template: TemplateRef<any>, deleteData) {
    this.modalRef = this.modalService.show(template, { ignoreBackdropClick: true });
    this.deleteStudent = deleteData;
  };

  removeStudent(student) {
    //Delete logic goes here
    this.toastr.success('Student deleted successfully');
    //console.log(student);
   // this.modalRef.hide();
  }
}
