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
  public loadingIndicator: Promise<any>;
  public placeholder = 'mm/dd/yyyy';
  public modalRef: BsModalRef;
  public timeLineForm: FormGroup;
  public messageType: FormControl;
  public messageTo: FormControl;
  public message: FormControl;
  public schoolUserName: FormControl;
  public instituteUserName: FormControl;
  public addedBy: String;
  public addedUser: String;
  public showEditButton: boolean = false;
  public timeLineConfig: Object =  timeLineConfig;
  public timeLineEvents: any;
  public roleType: Number;
  public error: any;
  public timeLineEventsMsg: String;
  
  constructor(private modalService: BsModalService,
    private eleRef: ElementRef,
    private dataService: DataService) { }

  ngOnInit() {
    AdminLTE.init();
    this.messageType = new FormControl('', []);
    this.message = new FormControl('', []);
    this.messageTo = new FormControl('', []);
    this.schoolUserName = new FormControl('', []);
    this.instituteUserName = new FormControl('', []);
    this.roleType = parseInt(localStorage.getItem('role'),10);
    this.addedBy = localStorage.getItem('name');
    this.addedUser =  (this.roleType == 101) ? localStorage.getItem('instituteUserName') 
                                             : localStorage.getItem('schoolUserName') ;
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

  public createEditTimeline(template: TemplateRef<any>, timelineInfo) {
    this.modalRef = this.modalService.show(template, { ignoreBackdropClick: true });
    if (timelineInfo !== '') {
      this.showEditButton = true;
      this.timeLineForm.setValue(timelineInfo);
    } else {
      this.timeLineForm.reset();
      this.showEditButton = false;
    }
  }

  getTimelineEvents() {
    // get this info from LocalStorage
    let schoolUserName = localStorage.getItem('schoolUserName');
    let instituteUserName = localStorage.getItem('instituteUserName');
    let messageTo = localStorage.getItem('roleType');
    let timeLineMode = this.roleType == 101 && this.roleType || 0;
    
    
    this.loadingIndicator = this.dataService.getTimelineEvents({schoolUserName, instituteUserName, messageTo, timeLineMode})
      .then((resp) => {
        if (resp.json().success) {
          this.timeLineEvents = resp.json().timeLineEvets;
          this.timeLineEventsMsg = this.timeLineEvents.length == 0 ? `No Timeline Events Found` : ``;
        }
        else this.error = `timeline loading failed..!`;
      });

      if(this.roleType == 102){
        this.dataService.getTimelineEvents({schoolUserName })
        .then((resp) => {
        if (resp.json().success) {
          const localEvents = [
            ...this.timeLineEvents,
            ...(resp.json().timeLineEvets)
          ];

          this.timeLineEvents = localEvents.filter((obj, pos, arr) =>
            arr.map(mapObj => mapObj['message']).indexOf(obj['message']) === pos
          );
        }
      });
      }
  }

  public saveTimeline(timeLineForm) {
    if (this.timeLineForm.valid) {
      // Get this info From local storage
      this.timeLineForm.value.schoolUserName = localStorage.getItem('schoolUserName');
      this.timeLineForm.value.instituteUserName = localStorage.getItem('instituteUserName');
      this.timeLineForm.value.addedBy = this.addedBy;
      this.timeLineForm.value.addedUser = this.addedUser;
      // this.timeLineForm.value.schoolName = localStorage.getItem('schoolUserName');
      // this.timeLineForm.value.instituteName = localStorage.getItem('instituteUserName');

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

  public updateTimeline(updatetimeline): void {
    console.log(updatetimeline.value);
  }
}
