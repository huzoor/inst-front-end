import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataService } from '../../shared/data.service';
declare var AdminLTE: any;

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  public changePasswordForm: FormGroup;
  public currentPassword: FormControl;
  public newPassword: FormControl;
  public confirmPassword: FormControl;
  public passwordMatchError: string;
  public currentPasswordError: string;

  public parmUserName: String;
  public parmType: String;

  constructor(private dataService: DataService, 
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private loadingIndicator: NgxSpinnerService) {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      console.log('queryParams', params  );
      this.parmUserName = params.userName;
      this.parmType = params.type;
    });
   }

  ngOnInit() {
    AdminLTE.init();
    this.currentPassword = new FormControl('', []);
    this.newPassword = new FormControl('', []);
    this.confirmPassword = new FormControl('', []);
    this.formFileds();
  }

  formFileds() {
    this.changePasswordForm = new FormGroup({
      currentPassword: this.currentPassword,
      newPassword: this.newPassword,
      confirmPassword: this.confirmPassword
    });
  }
  getRestType(role){
    switch(role){
      case 100: return 'Admin';
      case 101: return 'Inst';
      case 102: return 'Sch';
      case 103: return 'Stf';
      case 104: return 'Stu';
    }
  }
  changePaswword(formData: any): void {
    console.log(formData.value);
    var passwordForm: any = formData.value;
    this.loadingIndicator.show();
    // check currentpassword from backend if it required
    if ("success") {
      if(passwordForm.newPassword === passwordForm.confirmPassword) {
        console.log("success");
        let resetFormInfo = {}
        this.passwordMatchError = ``;
        if(this.parmUserName && this.parmType)
          resetFormInfo = {
            ...passwordForm,
            userName: `${this.parmUserName}`,
            instanceUrl: `reset${this.parmType}Password`,
          }
        else {
          let resetString = this.getRestType(parseInt(localStorage.getItem('role'), 10));
          resetFormInfo = {
            ...passwordForm,
            userName: `${localStorage.getItem(`userName`)}`,
            instanceUrl: `reset${resetString}Password`,
          };
        }
        this.dataService.resetPassword(resetFormInfo)
        .then((resp) => {
          if (resp.json().success) {
          //  this.passwordMatchError = resp.json().message;
           this.toastr.success(resp.json().message);
           setTimeout(()=> this.dataService.logout(), 200)
          } else {
            // this.passwordMatchError = resp.json().message;
            this.toastr.error(`Please enter valid password`);
            this.loadingIndicator.hide();
          }
        })
        .catch((err) => {
          console.log('password change Err', err);
          // this.passwordMatchError = err.json().message;
          this.toastr.error(`Please enter valid password`);
          this.loadingIndicator.hide();
        });

      } else {
        this.passwordMatchError = `Password and Confirmpaswword are not matching`;
        this.toastr.error(`Password and Confirmpaswword are not matching`);
        this.loadingIndicator.hide();
      }
    } else {
      this.passwordMatchError = `Current password is not matching`;
      this.toastr.error(`Current password is not matching`);
      this.loadingIndicator.hide();
    } 
  }
}
