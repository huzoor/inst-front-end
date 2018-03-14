import { Component, OnInit, TemplateRef, ElementRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MyDatePickerModule, IMyDpOptions } from 'mydatepicker';
import { DataService } from '../../shared/data.service';

declare var AdminLTE: any;
@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css']
})
export class AttendanceComponent implements OnInit {
  public placeholder = 'mm/dd/yyyy';
  public attendanceForm: FormGroup;
  public showAttendanceList = false;
  public selectDate: FormControl;
  public className: FormControl;
  public subject: FormControl;
  public studentList: any = [];
  public classList: any = [];
  public subjectsList: any = [];
  public selectedAll: any;
  public selectedStudent: any = [];
  public addAttendance: any;
  public viewCurrentAttendance: any;
  public showAttendance = false;
  public error: any;
  constructor(private modalService: BsModalService,
    private eleRef: ElementRef,
    private dataService: DataService) { }

  ngOnInit() {
    AdminLTE.init();
    this.selectDate = new FormControl('', []);
    this.subject = new FormControl('', []);
    this.className = new FormControl('', []);
    this.formFileds();
    this.getEntitiesList();
  }

  formFileds() {
    this.attendanceForm = new FormGroup({
      className: this.className,
      subject: this.subject,
      selectDate: this.selectDate
    });
  }

  public getStudentsList(formInfo) {
    // get this info from LocalStorage
    let schoolUserName = 'sch1-SCH';
    let instituteUserName = 'inst1-INST';
    let classEnrolled = formInfo.value.className;
    this.showAttendanceList = true;
    console.log('formInfo', formInfo.value);
    this.dataService.getStudentsList({schoolUserName, instituteUserName, classEnrolled})
      .then((resp) => {
        if (resp.json().success) this.studentList = resp.json().studentsList;
        else this.error = 'students list loading failed..!';
      });
  }

  public getEntitiesList() {
    // Get instituteUserName from localStorage
    let instituteUserName = 'inst1-INST';
   this.dataService.getEntitiesList(instituteUserName)
    .then((resp) => {
      if (resp.json().success) {
        this.classList = resp.json().Classes;
        this.subjectsList = resp.json().Subjects;
      }
        else this.error = resp.json().message;
    }).catch((err) => {
      console.log('err',err)
      this.error = err.json().message;
    })
  }

  public selectAllStudents(): void {
    for (let i = 0; i < this.studentList.length; i++) {
      this.studentList[i].selected = this.selectedAll;
      if (this.selectedAll) {
        this.selectedStudent.push({rollNumber: this.studentList[i].rollNumber});
      } else {
        this.selectedStudent = [];
      }
    }
  }

  public checkAllSelected(row) {
    if (row.selected === true) {
      this.selectedStudent.push({rollNumber: row.rollNumber});
    } else {
      this.selectedStudent.splice(this.selectedStudent.indexOf({rollNumber: row.rollNumber}), 1);
    }
    console.log(this.selectedStudent);
  }

  public saveAttendance(): void {
    // Get instituteUserName from localStorage
    let schoolUserName = 'sch1-SCH';
    let instituteUserName = 'inst1-INST';
    let attendanceTakenBy = 'huzoor-STF';

    let saveAttendance: Object = {
      class: this.className.value,
      subject: this.subject.value,
      date: this.selectDate.value.formatted,
      presentiesList: this.selectedStudent,
      schoolUserName,
      instituteUserName,
      attendanceTakenBy,
    };
    console.log(saveAttendance);

    this.dataService.addAttendance(saveAttendance)
    .then((resp) => {
      if (resp.json().success) {
        this.classList = resp.json().Classes;
        this.subjectsList = resp.json().Subjects;
      }
        else this.error = resp.json().message;
    }).catch((err) => {
      console.log('err',err)
      this.error = err.json().message;
    })
  }

  public viewAttendance(): void {
    this.showAttendance = true;
    this.viewCurrentAttendance = [{
      rollNumber: 2000,
      name: 'koppala',
      selected: true
    },
    {
      rollNumber: 2001,
      name: 'koppala1',
      selected: false
    },
    {
      rollNumber: 2002,
      name: 'koppala2',
      selected: true
    },
    {
      rollNumber: 2002,
      name: 'koppala1',
      selected: true
    },
    {
      rollNumber: 2004,
      name: 'koppala1',
      selected: false
    }];
  }
}
