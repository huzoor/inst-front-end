import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  public myform: FormGroup;
  constructor(private router: Router) { }

  ngOnInit() {
    this.loginForm();
  }
  loginForm() {
    this.myform = new FormGroup({
      userName: new FormControl(),
      password: new FormControl()
    });
  }

  public userAuthentication(myForm) {
    console.log(myForm.value);
    this.router.navigate(['/admin/dashboard']);
  }

}
