import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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


  constructor(private router: Router, private auth: DataService) { }

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
  }

}
