import { Component, OnInit, TemplateRef, ElementRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MyDatePickerModule, IMyDpOptions } from 'mydatepicker';
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
  public showApprovedData: boolean = false;
  public modalRef: BsModalRef;
  public leaveForm: FormGroup;
  public fromDate: FormControl;
  public toDate: FormControl;
  public reason: FormControl;
  public appliedBy: FormControl;
  public userRole: FormControl;
  public schoolUserName: FormControl;
  public instituteUserName: FormControl;
  public leaveID: FormControl;
  public error: any;
  public deleteLeaveRecord: any;
  public disableButton: boolean = false;
  public userRoleType: any;
  public showTable: boolean = false;
  public showEditForm: boolean = false; 
  public showLeaveApprovedList: boolean = false; 
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
    this.leaveID = new FormControl('', []);
    this.formFileds();
    this.userRoleType = parseInt(localStorage.getItem('role'), 10);
    if (this.userRoleType !== 101 )
    this.getLeavesList('list');

    // if (this.userRoleType == 102 || this.userRoleType == 103)
    //   this.getLeavesList('approve');

    if (this.userRoleType !== 104 )
      this.getLeavesList('approve');
    
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
          if (listMode == 'approve') {
            this.approveLeavesList = resp.json().LeavesList;
            this.showApprovedData = this.approveLeavesList.length === 0 ? true : false;
            if (this.userRoleType == 101) this.showLeaveApprovedList = true;
          }
          else {
            this.leavesList = resp.json().LeavesList;
            this.showTable = this.leavesList.length === 0 ? true : false;
          }
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
      toDate: this.toDate,
      leaveID: this.leaveID,
    });
  }

  public createEditLeave(template: TemplateRef<any>, editLeave) {
    this.modalRef = this.modalService.show(template, { ignoreBackdropClick: true });
    console.log(editLeave);
    if (editLeave !== '') {
      this.disableButton = false;
      this.showEditForm = true;
      const fromDate = new Date(editLeave.fromDate);
      const setFromDate = { "date": { "year": fromDate.getFullYear(), "month": (fromDate.getMonth() + 1), "day": fromDate.getDate() }, "jsdate": "", "formatted": editLeave.fromDate, "epoc": "" }
      const toDate = new Date(editLeave.toDate);
      const setToDate = { "date": { "year": toDate.getFullYear(), "month": (toDate.getMonth() + 1), "day": toDate.getDate() }, "jsdate": "", "formatted": editLeave.toDate, "epoc": "" }
      this.leaveForm.setValue({
        leaveID: editLeave._id,
        fromDate: setFromDate,
        reason: editLeave.reason,
        toDate: setToDate
      });

    } else {
      this.leaveForm.reset();
      this.disableButton = false;
      this.showEditForm = false;
    }

  }

  public applyLeave(leaveForm) {
    // Get this info From local storage
    this.loadingIndicator.show();
    this.disableButton = true;
    this.leaveForm.value.schoolUserName = localStorage.getItem('schoolUserName');
    this.leaveForm.value.instituteUserName = localStorage.getItem('instituteUserName');
    this.leaveForm.value.appliedBy = localStorage.getItem('userName');
    this.leaveForm.value.appliedUser = localStorage.getItem('name');
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
            if (role == 101 || role == 102 || role == 103)
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

  //Update Leave form
  public updateLeave(leaveForm): void {
    console.log(leaveForm.value);
    this.loadingIndicator.show();
    this.dataService.updateLeave({ ...leaveForm.value })
      .then((resp) => {
        this.loadingIndicator.hide();
        if (resp.json().success) {
          this.modalRef.hide();
          this.getLeavesList('list');
          this.getLeavesList('approve');
          this.toastr.success(`${resp.json().message}`);
        } else this.toastr.error(`${resp.json().message}`);
      })
      .catch((err) => {
        this.loadingIndicator.hide();
        this.error = err.json().message;
        this.toastr.success(`Error in approving leave, please retry`);
      });
  };

  public showLeaveApproveList(): void {
    this.showLeaveApprovedList = true;
  };

  public approveLeave(approveLeave: any): void {
    // console.log(approveLeave);
    this.loadingIndicator.show();
    let approvedUser = localStorage.getItem('name');
    let approvedUserName = localStorage.getItem('userName');
    let userRole = localStorage.getItem('roleType');
    this.dataService.approveLeave({ ...approveLeave, approvedUser, approvedUserName, userRole })
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
    let rejectedUser = localStorage.getItem('name');
    let rejectedUserName = localStorage.getItem('userName');
    let userRole = localStorage.getItem('roleType');
    this.dataService.rejectLeave({ ...removeLeave, rejectedUser, rejectedUserName, userRole })
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
    this.modalRef = this.modalService.show(template, { ignoreBackdropClick: true, class: 'custom-modal' });
    this.deleteLeaveRecord = deleteData;
  };

  removeLeaveRecord(data) {
    this.loadingIndicator.show();
    this.modalRef.hide();
    let deletedUser = localStorage.getItem('name');
    let deletedUserName = localStorage.getItem('userName');
    let userRole = localStorage.getItem('roleType');
    this.dataService.deleteLeave({ ...data, deletedUser, deletedUserName, userRole })
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
