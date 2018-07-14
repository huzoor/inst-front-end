import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../../shared/data.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  public forgotForm: FormGroup;
  public userRileList: any;
  public email: FormControl;
  public userRole: FormControl;
  public error: any;


  constructor(private router: Router, 
    private toastr: ToastrService,
    private auth: DataService) { }

  ngOnInit() {
    this.userRileList = ["Admin", "Institute", "School", "Staff", "Student"];
    this.email = new FormControl('', [Validators.required]);
    this.userRole = new FormControl('');

    this.forgotForm = new FormGroup({
      userRole: this.userRole,
      email: this.email
    });
  }

  forgotPassword(): void {
    console.log(this.forgotForm.value);
    if(this.forgotForm.valid){
      let instanceUri = `change${this.forgotForm.value.userRole}Password`;
      this.auth.changePassword( {...this.forgotForm.value} )
        .then((changeRes) => {
          // console.log(changeRes.json())
          if (changeRes.json().success) {
            this.toastr.success(`${changeRes.json().message}`);
            this.error = changeRes.json().message;
          } else {
            this.toastr.error(`${changeRes.json().message}`);
            this.error = changeRes.json().message;
          }
        })
        .catch((err) => {
          console.log('change Err', err);
          this.toastr.error(`Password Change Error, Please try again`);
          this.error = err.json().message;
        });
    }
  }

}
