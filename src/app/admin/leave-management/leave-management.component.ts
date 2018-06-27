import { Component, OnInit, TemplateRef, ElementRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MyDatePickerModule, IMyDpOptions } from 'mydatepicker';
import { DatePipe } from '@angular/common';
import { DataService } from '../../shared/data.service';
import { ToastrService } from 'ngx-toastr';
declare var AdminLTE: any;
@Component({
  selector: 'app-leave-management',
  templateUrl: './leave-management.component.html',
  styleUrls: ['./leave-management.component.css']
})
export class LeaveManagementComponent implements OnInit {
  public loadingIndicator: Promise<any>;
  public placeholder = 'mm/dd/yyyy';
  public leavesList: any;
  public modalRef: BsModalRef;
  public leaveForm: FormGroup;
  public fromDate: FormControl;
  public toDate: FormControl;
  public reason: FormControl; 
  public appliedBy: FormControl; 
  public userRole: FormControl; 
  public schoolUserName: FormControl;
  public instituteUserName: FormControl; 
  public error: any;
  public deleteLeaveRecord: any;
  public disableButton: boolean = false;

  constructor(private modalService: BsModalService,
    private eleRef: ElementRef,
    private dataService: DataService,
    private toastr: ToastrService) { }

  ngOnInit() {
    AdminLTE.init();
    this.fromDate = new FormControl('', []);
    this.reason = new FormControl('', []);
    this.toDate = new FormControl('', []);
    this.appliedBy = new FormControl('', []);
    this.userRole = new FormControl('', []);
    this.schoolUserName = new FormControl('', []);
    this.instituteUserName = new FormControl('', []);
    this.formFileds();

    this.getLeavesList();
  }
  getLeavesList() {
    // get this info from LocalStorage
    let schoolUserName = 'sch1-SCH';
    let instituteUserName = 'inst1-INST';
    let appliedBy = 'huzoor-STF';
    this.loadingIndicator = this.dataService.getleavesList({schoolUserName, instituteUserName, appliedBy })
      .then((resp) => {
        if (resp.json().success) {
          this.leavesList = resp.json().LeavesList;
        } else {
          this.error = 'LeavesList loading failed..!';
        }
      });
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
    this.disableButton = false;
  }

  public onSubmit(leaveForm) {
    // Get this info From local storage
    this.disableButton = true;
    this.leaveForm.value.schoolUserName = 'sch1-SCH';
    this.leaveForm.value.instituteUserName = 'inst1-INST';
    this.leaveForm.value.appliedBy = 'huzoor-STF';
    this.leaveForm.value.userRole = 'staff';

    if (this.leaveForm.valid) {
      this.error = '';
     this.loadingIndicator = this.dataService.applyLeave(this.leaveForm.value)
        .then((resp) => {
          if (resp.json().success) {
            this.leaveForm.reset();
            this.modalRef.hide();
            this.getLeavesList();
            this.toastr.success('Leave applied successfully');
          } else {
            this.error = resp.json().message;
          }
        })
        .catch((err) => {
          this.error = err.json().message;
        });
    }
  }

  public approveLeave(approveLeave: any): void {
    console.log(approveLeave);
  }

  public cancelLeave(approveLeave: any): void {
    console.log(approveLeave);
  }

  public deleteLeaveInfo(template: TemplateRef<any>, deleteData) {
    this.modalRef = this.modalService.show(template, { ignoreBackdropClick: true });
    this.deleteLeaveRecord = deleteData;
  };

  removeLeaveRecord(data) {
    //Delete logic goes here
    this.modalRef.hide();
    this.toastr.success('Applied Leave deleted successfully');
  }

}
