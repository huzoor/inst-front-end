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
  public selectDate: FormControl;
  public className: FormControl;
  public subject: FormControl;
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
  }

  formFileds() {
    this.attendanceForm = new FormGroup({
      className: this.className,
      subject: this.subject,
      selectDate: this.selectDate
    });
  }

}
