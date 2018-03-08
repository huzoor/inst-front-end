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

  public timeLineConfig: Object =  timeLineConfig;
  public error: any;
  constructor(private modalService: BsModalService,
    private eleRef: ElementRef,
    private dataService: DataService) { }

  ngOnInit() {
    AdminLTE.init();
    this.messageType = new FormControl('', []);
    this.message = new FormControl('', []);
    this.messageTo = new FormControl('', []);
    this.formFileds();

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

  public onSubmit(timeLineForm) {
    // if (this.timeLineForm.valid) {
    //   this.error = '';
    //   this.dataService.timeline(this.timeLineForm.value)
    //     .then((resp) => {
    //       if (resp.json().success) {
    //         this.timeLineForm.reset();
    //         this.modalRef.hide();
    //         this.getLeavesList();
    //       } else {
    //         this.error = resp.json().message;
    //       }
    //     })
    //     .catch((err) => {
    //       this.error = err.json().message;
    //     });
    // }
  }
}
