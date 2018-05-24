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
  public email: FormControl;
  public error: any;


  constructor(private router: Router, private auth: DataService) { }

  ngOnInit() {
    this.email = new FormControl('', [Validators.required]);

    this.forgotForm = new FormGroup({
      email: this.email
    });
  }

  forgotPassword(): void {
    console.log(this.forgotForm.value.email);
  }

}
