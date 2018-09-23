import { Component, OnInit, TemplateRef, ElementRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MyDatePickerModule, IMyDpOptions } from 'mydatepicker';
import { DataService } from '../../shared/data.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
declare var AdminLTE: any;
@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css']
})
export class AttendanceComponent implements OnInit {

  public placeholder: String = 'mm/dd/yyyy';
  public attendanceForm: FormGroup;
  public viewAttendanceForm: FormGroup;
  public showAttendanceList: Boolean = false;
  public selectDate: FormControl;
  public className: FormControl;
  public subject: FormControl;

  public viewSelectDate: FormControl;
  public viewClassName: FormControl;
  public viewSubject: FormControl;

  public studentList: any = new Array;
  public classList: any = new Array;
  public subjectsList: any = new Array;
  public selectedAll: any;
  public selectedStudent: any = new Array;
  public addAttendance: any;
  public viewCurrentAttendance: any = new Array;
  public showAttendance = false;
  public error: String = '';
  public userRoleType: any;
  public currentDate: any;
  constructor(private modalService: BsModalService,
    private eleRef: ElementRef,
    private dataService: DataService,
    private toastr: ToastrService,
    private loadingIndicator: NgxSpinnerService) { }

  ngOnInit() {
    AdminLTE.init();
    this.loadingIndicator.show();
    this.selectDate = new FormControl('', []);
    this.subject = new FormControl('', []);
    this.className = new FormControl('', []);
    this.viewSelectDate = new FormControl('', []);
    this.viewClassName = new FormControl('', []);
    this.viewSubject = new FormControl('', []);
    this.userRoleType = parseInt(localStorage.getItem('role'), 10);

    this.formFileds();
    this.getClassesList();
    // this.getSubjectsList();
    // this.getEntitiesList();
    
    let currentDate: Date = new Date();
    let formatted = `${ currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`;
    this.selectDate.setValue({ formatted, date: {year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate()} });
    this.viewSelectDate.setValue({ formatted, date: {year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate()} });
    
    if(this.userRoleType == 104)
      document.getElementById('_tab2').click()
  }

  formFileds() {
    this.attendanceForm = new FormGroup({
      className: this.className,
      subject: this.subject,
      selectDate: this.selectDate
    });

    this.viewAttendanceForm = new FormGroup({
      viewClassName: this.viewClassName,
      viewSubject: this.viewSubject,
      viewSelectDate: this.viewSelectDate
    });
  }

  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'm/d/yyyy'
  };

  public takeAttendancedatePickerOptions: IMyDpOptions = {
    dateFormat: 'm/d/yyyy',
    disableHeaderButtons: true
  }

  public onClassChange(classId) {
    this.error = '';
    this.getSubjectsList(classId);
    this.studentList = [];
  }
  
  public onViewClassChange(classId) {
    this.viewCurrentAttendance = [];
    this.getSubjectsList(classId);
  }


  public getStudentsList(formInfo) {
    // get this info from LocalStorage
    this.loadingIndicator.show();
    let schoolUserName = localStorage.getItem('schoolUserName');
    let instituteUserName = localStorage.getItem('instituteUserName');
    let classEnrolled = formInfo.value.className;
    this.showAttendanceList = true;
     console.log('formInfo', formInfo.value);
    this.dataService.getStudentsList({ schoolUserName, instituteUserName, classEnrolled })
      .then((resp) => {
        this.loadingIndicator.hide();
        if (resp.json().success) {
          if (resp.json().studentsList.length == 0){
            //  this.error = 'No students found...';
             this.toastr.success(`No students found...`);
             this.studentList=[];
          }
          else this.studentList = resp.json().studentsList;
        }
        else this.toastr.error(`students list loading failed..!`);
      });
  }

  public getClassesList(): void {
    // Get instituteUserName from localStorage
    let instituteUserName = localStorage.getItem('instituteUserName');
    let entityType = 'classes';

    this.dataService.getEntitiesList({ instituteUserName, entityType })
      .then((resp) => {
        this.loadingIndicator.hide();
        let res = resp.json()
        if (res.success) {
          this.classList = res.Classes;
        } else this.toastr.success(`${resp.json().message}`);
        
      }).catch((err) => {
        this.loadingIndicator.hide();
        // this.error = err.json().message;
        this.toastr.success(`${err.json().message}`);
      });
  }

  public getSubjectsList(classId): void {
    // Get instituteUserName from localStorage
    let instituteUserName = localStorage.getItem('instituteUserName');
    let schoolUserName = localStorage.getItem('schoolUserName');
    let entityType = 'subjects';

    this.dataService.getEntitiesList({ instituteUserName, entityType, schoolUserName, classId })
      .then((resp) => {
        this.loadingIndicator.hide();
        let res = resp.json()
        if (res.success) {
          this.subjectsList = res.Subjects;
        } else this.toastr.error(`${resp.json().message}`); 
        // this.error = resp.json().message;

      }).catch((err) => {
        this.loadingIndicator.hide();
        // this.error = err.json().message;
        this.toastr.error(`${err.json().message}`);
      });
  }

  public selectAllStudents(): void {
    for (let i = 0; i < this.studentList.length; i++) {
      this.studentList[i].selected = this.selectedAll;
      if (this.selectedAll) {
        this.selectedStudent.push({
          classCode: this.className.value,
          subjectCode: this.subject.value,
          rollNumber: this.studentList[i].rollNumber,
          studentName: this.studentList[i].name,
        });
      }
      else {
        this.selectedStudent = [];
      }
    }
  }

  public checkAllSelected(row) {
    if (row.selected === true) {
      this.selectedStudent.push({ classCode: this.className.value, subjectCode: this.subject.value, rollNumber: row.rollNumber });
    } else {
      // this.selectedStudent.splice(this.selectedStudent.indexOf({classCode: this.className.value, subjectCode: this.subject.value, rollNumber: row.rollNumber, isAttended: true}), 1);
      this.selectedStudent.splice(this.selectedStudent.indexOf({ classCode: this.className.value, subjectCode: this.subject.value, rollNumber: row.rollNumber }), 1);
    }
    console.log(this.selectedStudent);
  }

  public removeDuplicates(myArr, prop) {
    return myArr.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
  }

  public resetAttendanceForm() {
    let currentDate: Date = new Date();
    let formatted = `${ currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`;
    this.selectDate.setValue({ formatted, date: {year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate()} });
    
    // this.selectDate = new FormControl('', []);
    // // this.attendanceForm.reset();
    // this.subject = new FormControl('', []);
    // this.className = new FormControl('', []);
    this.studentList = [];
  }

  public saveAttendance(): void {
    // Get instituteUserName from localStorage
    this.loadingIndicator.show();
    let schoolUserName = localStorage.getItem('schoolUserName');
    let instituteUserName = localStorage.getItem('instituteUserName');
    let attendanceTakenBy = localStorage.getItem('userName');

    let filterdArr = this.removeDuplicates(this.selectedStudent, 'studentName')

    let saveAttendance: Object = {
      classCode: this.className.value,
      subjectCode: this.subject.value,
      createdOn: this.selectDate.value.formatted,
      presentiesList: filterdArr,
      schoolUserName,
      instituteUserName,
      attendanceTakenBy,
    };

    console.log(saveAttendance);

    this.dataService.addAttendance(saveAttendance)
      .then((resp) => {
        this.loadingIndicator.hide();
        if (resp.json().success) {
          this.selectedStudent = [];
          this.selectedAll = false;
          this.studentList.map((item, i) => this.studentList[i].selected = false);
          this.resetAttendanceForm();
          this.toastr.success('Attendance taken successfully');
          // this.error = resp.json().message;
        } else this.error = resp.json().message;
      }).catch((err) => {
        this.loadingIndicator.hide();
        // this.error = err.json().message;
        this.toastr.error(`${err.json().message}`);
      })
  }

  public viewAttendance(formInfo): void {
    this.showAttendance = true;
    this.error = '';
    let schoolUserName = localStorage.getItem('schoolUserName');
    let instituteUserName = localStorage.getItem('instituteUserName');
    let classCode = formInfo.value.viewClassName;
    let subjectCode = formInfo.value.viewSubject;
    let createdOn = formInfo.value.viewSelectDate.formatted;
    this.loadingIndicator.show();
    // console.log(this.viewAttendanceForm.value);

    this.dataService.getAttendance({ instituteUserName, schoolUserName, classCode, subjectCode, createdOn })
      .then((resp) => {
        this.loadingIndicator.hide();
        if (resp.json().success) {
          this.viewCurrentAttendance = [];
          if (resp.json().attendanceInfo.length == 0){
             this.toastr.error(`No Records Found`);
            } 
          else{
            let studentsInfo = resp.json().attendanceInfo[0].presentiesList;
            let presentiesList = studentsInfo.filter(item => item.classCode == classCode )
                                             .filter(item => item.subjectCode == subjectCode );
            if(this.userRoleType == 104 ){
              let selectedStudentName = localStorage.getItem('name').trim();
              this.viewCurrentAttendance = presentiesList.filter(item => item.studentName == selectedStudentName );
            } else this.viewCurrentAttendance = presentiesList
          }
        } else this.toastr.error(`${resp.json().message}`); 
      }).catch((err) => {
        console.log(err)
        this.loadingIndicator.hide();
        // this.error = err.json().message
        this.toastr.error(`${err.json().message}`);
      });
  }
}
