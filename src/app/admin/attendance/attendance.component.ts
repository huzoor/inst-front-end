import { Component, OnInit, TemplateRef, ElementRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MyDatePickerModule, IMyDpOptions } from 'mydatepicker';
import { DataService } from '../../shared/data.service';
import { ToastrService } from 'ngx-toastr';

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
  public viewCurrentAttendance: any;
  public showAttendance = false;
  public error: String='';
  constructor(private modalService: BsModalService,
    private eleRef: ElementRef,
    private dataService: DataService,
    private toastr: ToastrService) { }

  ngOnInit() {
    AdminLTE.init();
    this.selectDate = new FormControl('', []);
    this.subject = new FormControl('', []);
    this.className = new FormControl('', []);
   
    this.viewSelectDate = new FormControl('', []);
    this.viewClassName = new FormControl('', []);
    this.viewSubject = new FormControl('', []);

    
    this.formFileds();
    this.getClassesList();
    this.getSubjectsList();
    // this.getEntitiesList();
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
    dateFormat: 'm/d/yyyy',
  };

  public getStudentsList(formInfo) {
    // get this info from LocalStorage
    let schoolUserName = localStorage.getItem('schoolUserName');
    let instituteUserName = localStorage.getItem('instituteUserName');
    let classEnrolled = formInfo.value.className;
    this.showAttendanceList = true;
    // console.log('formInfo', formInfo.value);
    this.dataService.getStudentsList({schoolUserName, instituteUserName, classEnrolled})
      .then((resp) => {
        if (resp.json().success) {
          if(resp.json().studentsList.length == 0)  this.error = 'No students found...';          
          else this.studentList = resp.json().studentsList;
        }
        else this.error = 'students list loading failed..!';
      });
  }

  public getClassesList(): void {
    // Get instituteUserName from localStorage
    let instituteUserName = localStorage.getItem('instituteUserName');
    let entityType ='classes';

    this.dataService.getEntitiesList({instituteUserName, entityType })
      .then((resp) => {
        let res = resp.json()
        if (res.success) {
          this.classList = res.Classes;
        } else this.error = resp.json().message;
        
      }).catch((err) => {
        console.log('err',err)
        this.error = err.json().message;
      });
  }
 
  public getSubjectsList(): void {
    // Get instituteUserName from localStorage
    let instituteUserName = localStorage.getItem('instituteUserName');
    let entityType ='subjects';

    this.dataService.getEntitiesList({instituteUserName, entityType })
      .then((resp) => {
        let res = resp.json()
        if (res.success) {
          this.subjectsList = res.Subjects;
        } else this.error = resp.json().message;
        
      }).catch((err) => {
        console.log('err',err)
        this.error = err.json().message;
      });
  }

  public selectAllStudents(): void {
    for (let i = 0; i < this.studentList.length; i++) {
      this.studentList[i].selected = this.selectedAll;
      if (this.selectedAll) {
        this.selectedStudent.push({ classCode: this.className.value, 
                                    subjectCode: this.subject.value, 
                                    rollNumber: this.studentList[i].rollNumber,
                                  });
      } 
      else {
        this.selectedStudent = [];
      }
    }
  }

  public checkAllSelected(row) {
    if (row.selected === true) {
      this.selectedStudent.push({classCode: this.className.value, subjectCode: this.subject.value, rollNumber: row.rollNumber });
    } else {
      // this.selectedStudent.splice(this.selectedStudent.indexOf({classCode: this.className.value, subjectCode: this.subject.value, rollNumber: row.rollNumber, isAttended: true}), 1);
      this.selectedStudent.splice(this.selectedStudent.indexOf({classCode: this.className.value, subjectCode: this.subject.value, rollNumber: row.rollNumber}), 1);
    }
    console.log(this.selectedStudent);
  }

  public removeDuplicates(myArr, prop) {
    return myArr.filter((obj, pos, arr) => {
        return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
  }

  public  resetAttendanceForm(){
    this.selectDate = new FormControl('', []);
    this.subject = new FormControl('', []);
    this.className = new FormControl('', []);
  }

  public saveAttendance(): void {
    // Get instituteUserName from localStorage
    let schoolUserName = localStorage.getItem('schoolUserName');
    let instituteUserName = localStorage.getItem('instituteUserName');
    let attendanceTakenBy = localStorage.getItem('userName');

    let filterdArr = this.removeDuplicates(this.selectedStudent, 'rollNumber')

    let saveAttendance: Object = {
      classCode: this.className.value,
      subjectCode: this.subject.value,
      createdOn: this.selectDate.value.formatted,
      presentiesList:filterdArr,
      schoolUserName,
      instituteUserName,
      attendanceTakenBy,
    };

    console.log(saveAttendance);

    this.dataService.addAttendance(saveAttendance)
    .then((resp) => {
      if(resp.json().success){ 
        this.selectedStudent = [];
        this.selectedAll = false;
        this.studentList.map((item, i)=> this.studentList[i].selected = false);
        this.resetAttendanceForm();
        this.toastr.success('Attendance taken successfully');
        this.error = resp.json().message;
      }
      else this.error = resp.json().message;
    }).catch((err) => {
      console.log('err',err)
      this.error = err.json().message;
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

    console.log(this.viewAttendanceForm.value);

    this.dataService.getAttendance({instituteUserName, schoolUserName, classCode, subjectCode, createdOn})
    .then((resp) => {
      if (resp.json().success) {
        if(resp.json().attendanceInfo.length == 0)  this.error = 'No records found...';          
        else this.viewCurrentAttendance = resp.json().attendanceInfo[0].presentiesList;
      } else this.error = resp.json().message;
    }).catch(err => this.error = err.json().message);
  }
}
