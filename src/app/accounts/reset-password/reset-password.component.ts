import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { DataService } from '../../shared/data.service';
declare var AdminLTE: any;
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  public resetPasswordForm: FormGroup;
  public newPassword: FormControl;
  public confirmPassword: FormControl;
  public passwordMatchError: string;

  public parmUserName: String;
  public parmType: String;

  constructor(private dataService: DataService, 
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute) {
   }

  ngOnInit() {
    AdminLTE.init();
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      console.log('params', params);
    });
    this.newPassword = new FormControl('', []);
    this.confirmPassword = new FormControl('', []);
    this.formFileds();
  }

  formFileds() {
    this.resetPasswordForm = new FormGroup({
      newPassword: this.newPassword,
      confirmPassword: this.confirmPassword
    });
  }

  resetPaswword(formData: any): void {
    console.log(formData.value);
    var passwordForm: any = formData.value;
    // check currentpassword from backend if it required
    if ("success") {
      if(passwordForm.newPassword === passwordForm.confirmPassword) {
        console.log("success");
        this.passwordMatchError = '';
      } else {
        this.passwordMatchError = "Password and Confirmpaswword are not matching";
      }
    } else {
      this.passwordMatchError = "Current password is not matching";
    } 
  }
}
