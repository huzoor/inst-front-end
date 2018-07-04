import { Component, OnInit, TemplateRef, ElementRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MyDatePickerModule, IMyDpOptions } from 'mydatepicker';
import { DatePipe } from '@angular/common';
import { DataService } from '../../shared/data.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
declare var AdminLTE: any;
@Component({
  selector: 'app-leave-management',
  templateUrl: './leave-management.component.html',
  styleUrls: ['./leave-management.component.css']
})
export class LeaveManagementComponent implements OnInit {

  public placeholder = 'mm/dd/yyyy';
  public leavesList: any;
  public approveLeavesList: any;
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
  public userRoleType: any;

  constructor(private modalService: BsModalService,
    private eleRef: ElementRef,
    private dataService: DataService,
    private toastr: ToastrService,
    private loadingIndicator: NgxSpinnerService) { }

  ngOnInit() {
    AdminLTE.init();
    this.loadingIndicator.show();
    this.fromDate = new FormControl('', []);
    this.reason = new FormControl('', []);
    this.toDate = new FormControl('', []);
    this.appliedBy = new FormControl('', []);
    this.userRole = new FormControl('', []);
    this.schoolUserName = new FormControl('', []);
    this.instituteUserName = new FormControl('', []);
    this.formFileds();
    this.userRoleType = parseInt(localStorage.getItem('role'), 10);
    this.getLeavesList('list');

    if (this.userRoleType == 102 || this.userRoleType == 103)
      this.getLeavesList('approve');

    if (this.userRoleType == 102) document.getElementById('getApproveList').click();

  }
  getLeavesList(listMode) {
    // get this info from LocalStorage
    let schoolUserName = localStorage.getItem('schoolUserName');
    let instituteUserName = localStorage.getItem('instituteUserName');
    let appliedBy = localStorage.getItem('userName');
    let role = parseInt(localStorage.getItem('role'), 10);

    this.dataService.getleavesList({ schoolUserName, instituteUserName, appliedBy, role, listMode })
      .then((resp) => {
        this.loadingIndicator.hide();
        if (resp.json().success) {
          if (listMode == 'approve')
            this.approveLeavesList = resp.json().LeavesList;
          else
            this.leavesList = resp.json().LeavesList;
        } else {
          this.loadingIndicator.hide();
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
    this.loadingIndicator.show();
    this.disableButton = true;
    this.leaveForm.value.schoolUserName = localStorage.getItem('schoolUserName');
    this.leaveForm.value.instituteUserName = localStorage.getItem('instituteUserName');
    this.leaveForm.value.appliedBy = localStorage.getItem('userName');
    this.leaveForm.value.userRole = localStorage.getItem('roleType');

    if (this.leaveForm.valid) {
      this.error = '';
      this.dataService.applyLeave(this.leaveForm.value)
        .then((resp) => {
          this.loadingIndicator.hide();
          if (resp.json().success) {
            let role = parseInt(localStorage.getItem('role'), 10);
            this.leaveForm.reset();
            this.modalRef.hide();
            this.getLeavesList('list');
            if (role == 102 || role == 103)
              this.getLeavesList('approve');

            this.toastr.success(`${resp.json().message}`);
          } else
            this.toastr.error(`${resp.json().message}`);

        })
        .catch((err) => {
          this.loadingIndicator.hide();
          this.error = err.json().message;
          this.toastr.success(`Error in appying leave, please retry`);
        });
    }
  }

  public approveLeave(approveLeave: any): void {
    console.log(approveLeave);
    this.loadingIndicator.show();
    let approvedUser = localStorage.getItem('userName');
    this.dataService.approveLeave({ ...approveLeave, approvedUser })
      .then((resp) => {
        this.loadingIndicator.hide();
        if (resp.json().success) {
          this.getLeavesList('approve');
          this.toastr.success(`${resp.json().message}`);
        } else this.toastr.error(`${resp.json().message}`);
      })
      .catch((err) => {
        this.loadingIndicator.hide();
        this.error = err.json().message;
        this.toastr.success(`Error in approving leave, please retry`);
      });
  }

  public rejectLeave(removeLeave: any): void {
    console.log(removeLeave);
    this.loadingIndicator.show();
    let rejectedUser = localStorage.getItem('userName');
    this.dataService.rejectLeave({ ...removeLeave, rejectedUser })
      .then((resp) => {
        this.loadingIndicator.hide();
        if (resp.json().success) {
          this.getLeavesList('approve');
          this.toastr.success(`${resp.json().message}`);
        } else this.toastr.error(`${resp.json().message}`);
      })
      .catch((err) => {
        this.loadingIndicator.hide();
        this.error = err.json().message;
        this.toastr.success(`Error in calcelling leave, please retry`);
      });
  }

  public deleteLeaveInfo(template: TemplateRef<any>, deleteData) {
    this.modalRef = this.modalService.show(template, { ignoreBackdropClick: true });
    this.deleteLeaveRecord = deleteData;


  };

  removeLeaveRecord(data) {
    this.loadingIndicator.show();
    this.modalRef.hide();
    let deletedUser = localStorage.getItem('userName');
    this.dataService.deleteLeave({ ...data, deletedUser })
      .then((resp) => {
        this.loadingIndicator.hide();
        if (resp.json().success) {
          this.getLeavesList('list');
          this.toastr.success('Leave cancelled successfully');
        } else this.toastr.error(`${resp.json().message}`);
      })
      .catch((err) => {
        this.error = err.json().message;
        this.toastr.success(`Error in calcelling leave, please retry`);
      });

  }

}
