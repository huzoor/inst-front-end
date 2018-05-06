import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MyDatePickerModule, IMyDpOptions } from 'mydatepicker';
const date = new Date();
@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  public myform: FormGroup;
  public placeholder = 'Date Of Birth';
  constructor() { }

  ngOnInit() {
    this.loginForm();
  }
  
  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'm/d/yyyy',
  };

  loginForm() {
    this.myform = new FormGroup({
      userName: new FormControl(),
      email: new FormControl(),
      password: new FormControl(),
      mobile: new FormControl(),
      address: new FormControl(),
      myDate: new FormControl()
    });
  }

  public userAuthentication(myForm) {
    console.log(myForm.value);
  }
}

