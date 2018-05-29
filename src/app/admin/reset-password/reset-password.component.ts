import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {Router, ActivatedRoute, Params} from '@angular/router';

import { DataService } from '../../shared/data.service';
declare var AdminLTE: any;
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  public changePasswordForm: FormGroup;
  public currentPassword: FormControl;
  public newPassword: FormControl;
  public confirmPassword: FormControl;
  public passwordMatchError: string;
  public currentPasswordError: string;

  public parmUserName: String;
  public parmType: String;

  constructor(private dataService: DataService, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      console.log('params', params  );
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

  changePaswword(formData: any): void {
    console.log(formData.value);
    var passwordForm: any = formData.value;
    // check currentpassword from backend if it required
    if ("success") {
      if(passwordForm.newPassword === passwordForm.confirmPassword) {
        console.log("success");
        this.passwordMatchError = '';
        const resetFormInfo = {
          ...passwordForm,
          userName: `${this.parmUserName}`,
          instanceUrl: `reset${this.parmType}Password`,
        }

        this.dataService.resetPassword(resetFormInfo)
        .then((resp) => {
          if (resp.json().success) {
           this.passwordMatchError = resp.json().message;
          } else {
            this.passwordMatchError = resp.json().message;
          }
        })
        .catch((err) => {
          console.log('password change Err', err);
          this.passwordMatchError = err.json().message;
        });


      } else {
        this.passwordMatchError = "Password and Confirmpaswword are not matching";
      }
    } else {
      this.passwordMatchError = "Current password is not matching";
    } 
  }
}
