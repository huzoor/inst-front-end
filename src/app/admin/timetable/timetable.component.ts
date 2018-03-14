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
  public classForm: FormGroup;
  public selectedClass: FormControl;
  public timeTableList: any = '';
  constructor() { }

  ngOnInit() {
    AdminLTE.init();
    this.selectedClass = new FormControl('', []);
    this.classForm = new FormGroup({
      selectedClass: this.selectedClass
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
}
