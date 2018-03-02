import { Component, OnInit, TemplateRef, ElementRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MyDatePickerModule, IMyDpOptions } from 'mydatepicker';
import { DataService } from '../../shared/data.service';

declare var AdminLTE: any;
@Component({
  selector: 'app-leave-management',
  templateUrl: './leave-management.component.html',
  styleUrls: ['./leave-management.component.css']
})
export class LeaveManagementComponent implements OnInit {
  public placeholder = 'mm/dd/yyyy';
  public leavesList: any;
  public modalRef: BsModalRef;
  public leaveForm: FormGroup;
  public fromDate: FormControl;
  public toDate: FormControl;
  public reason: FormControl;
  public error: any;
  constructor(private modalService: BsModalService,
    private eleRef: ElementRef,
    private dataService: DataService) { }

  ngOnInit() {
    AdminLTE.init();
    this.fromDate = new FormControl('', []);
    this.reason = new FormControl('', []);
    this.toDate = new FormControl('', []);
    this.formFileds();

    this.getLeavesList();
  }
  getLeavesList() {
    // this.dataService.getleavesList()
    //   .then((resp) => {
    //     if (resp.json().success) {
    //       this.leavesList = resp.json().schools;
    //     } else {
    //       this.error = 'schools loading failed..!';
    //     }
    //   });
  }

  formFileds() {
    this.leaveForm = new FormGroup({
      fromDate: this.fromDate,
      reason: this.reason,
      toDate: this.toDate
    });
  }

  public openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { ignoreBackdropClick: true });
  }

  public onSubmit(leaveForm) {
    // if (this.leaveForm.valid) {
    //   this.error = '';
    //   this.dataService.applyLeave(this.leaveForm.value)
    //     .then((resp) => {
    //       if (resp.json().success) {
    //         this.leaveForm.reset();
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
