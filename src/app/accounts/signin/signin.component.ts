import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { DataService } from '../../shared/data.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  public loginForm: FormGroup;
  public username: FormControl;
  public password: FormControl;
  public error: any;


  constructor(private router: Router, private auth: DataService) { }

  ngOnInit() {
    this.username = new FormControl('', [Validators.required]);
    this.password = new FormControl('', [Validators.required]);

    this.loginForm = new FormGroup({
      username: this.username,
      password: this.password,
    });
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      this.error = '';
      this.auth.login(this.loginForm.value)
        .then((user) => {
          if (user.json().success) {
            localStorage.setItem('token', user.json().auth_token);
            this.router.navigate(['/dashboard']);
          } else {
            this.error = user.json().message;
          }
        })
        .catch((err) => {
          console.log('Login Err', err);
          this.error = err.json().message;
        });
    } else {
      this.error = 'Please fill username / Password fields';
    }
  }

}
