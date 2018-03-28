import { Component, OnInit, TemplateRef, ElementRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MyDatePickerModule, IMyDpOptions } from 'mydatepicker';
import { timeLineConfig } from '../../shared/AppConstants';
import { DataService } from '../../shared/data.service';

declare var AdminLTE: any;
@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.css']
})
export class TimetableComponent implements OnInit {
  public modalRef: BsModalRef;
  public error: any;
  public subjectsList: any;
  public classForm: FormGroup;
  public timetableForm: FormGroup;
  public subjectCode: FormControl;
  public selectedClass: FormControl;
  public timeTableList: any = '';
  constructor(private dataService: DataService) { }

  ngOnInit() {
    AdminLTE.init();
    this.selectedClass = new FormControl('', []);
    this.subjectCode = new FormControl('', []);
    this.classForm = new FormGroup({
      selectedClass: this.selectedClass
    });
    this.timetableForm = new FormGroup({
      subjectCode: this.subjectCode
    });
  }
  
  public getClassWiseTimeTable(selectedClass): void {
    const tableList = require('./timetable.json');
    this.timeTableList = '';
    const getClassTimings = tableList.filter((item) => item.class === selectedClass);
    if (getClassTimings && getClassTimings.length !== 0) {
      this.timeTableList = getClassTimings[0].timetable;
    }
  };

  public getSubjectsList(): void {
    // Get instituteUserName from localStorage
    let instituteUserName = 'inst1-INST';
    let schoolUserName = 'sch1-SCH';
    this.dataService.getEntitiesList({ instituteUserName, schoolUserName })
      .then((resp) => {
        let res = resp.json()
        if (res.success) {
          this.subjectsList = res.Subjects;
        } else this.error = resp.json().message;

      }).catch((err) => {
        console.log('err', err)
        this.error = err.json().message;
      });
  }
}
