import { Component, OnInit, TemplateRef, ElementRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MyDatePickerModule, IMyDpOptions } from 'mydatepicker';
import { timeLineConfig } from '../../shared/AppConstants';
import { DataService } from '../../shared/data.service';

declare var AdminLTE: any;
@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit {
  public placeholder = 'mm/dd/yyyy';
  public modalRef: BsModalRef;
  public timeLineForm: FormGroup;
  public messageType: FormControl;
  public messageTo: FormControl;
  public message: FormControl;
  public schoolUserName: FormControl;
  public instituteUserName: FormControl;
  public schoolName: FormControl;
  public instituteName: FormControl;

  public timeLineConfig: Object =  timeLineConfig;
  public timeLineEvents: any[];
  public error: any;
  
  constructor(private modalService: BsModalService,
    private eleRef: ElementRef,
    private dataService: DataService) { }

  ngOnInit() {
    AdminLTE.init();
    this.messageType = new FormControl('', []);
    this.message = new FormControl('', []);
    this.messageTo = new FormControl('', []);
    this.schoolUserName = new FormControl('', []);
    this.schoolName = new FormControl('', []);
    this.instituteUserName = new FormControl('', []);
    this.instituteName = new FormControl('', []);
    
    this.formFileds();
    this.getTimelineEvents();
  }

  formFileds() {
    this.timeLineForm = new FormGroup({
      messageType: this.messageType,
      message: this.message,
      messageTo: this.messageTo
    });
  }

  public openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { ignoreBackdropClick: true });
  }

  getTimelineEvents() {
    // get this info from LocalStorage
    let schoolUserName = 'sch1-SCH';
    let instituteUserName = 'inst1-INST';
    this.dataService.getTimelineEvents({schoolUserName,instituteUserName})
      .then((resp) => {
        if (resp.json().success) this.timeLineEvents = resp.json().timeLineEvets;
        else this.error = 'schools loading failed..!';
      });
  }

  public onSubmitTimeline(timeLineForm) {
    if (this.timeLineForm.valid) {
      // Get this info From local storage
      this.timeLineForm.value.schoolUserName = 'sch1-SCH';
      this.timeLineForm.value.instituteUserName = 'inst1-INST';
      this.timeLineForm.value.schoolName = 'school1';
      this.timeLineForm.value.instituteName = 'Inst1';
      this.error = '';    
      this.dataService.addTimelineEvent(this.timeLineForm.value)
        .then((resp) => {
          if (resp.json().success) {
            this.timeLineForm.reset();
            this.modalRef.hide();
            this.getTimelineEvents();
          } else this.error = resp.json().message;
          
        }).catch((err) =>  this.error = err.json().message );
    }
  }
}
