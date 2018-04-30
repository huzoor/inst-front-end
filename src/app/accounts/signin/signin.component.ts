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
  getRoleType(type){
    switch(type){
      case "ADMIN":
        return `ADMIN`;
      case "INST":
        return `INST`;
      case "SCH":
        return `SCH`;
      case "STF":
        return `STF`;
      case "STU":
        return `STU`;
      default:
        return '';
    }
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      this.error = '';
      let userName = this.loginForm.value.username;
      if(userName.indexOf('-') > -1){
        let splitter = userName.split('-');
        let role = this.getRoleType(splitter[splitter.length-1].toUpperCase());
        if(role.length> 0 ){
            userName = `${splitter[0] +'-'+ role}`;
            let loginInfo = {
              ...this.loginForm.value,
              userName,
              role,
            };

            this.auth.login(loginInfo)
            .then((user) => {
              if (user.json().success) {
                localStorage.setItem('token', user.json().auth_token);
                localStorage.setItem('role', user.json().role);
                this.router.navigate(['/dashboard']);
              } else {
                this.error = user.json().message;
              }
            })
            .catch((err) => {
              console.log('Login Err', err);
              this.error = err.json().message;
            });
          }
        else this.error = 'Please fill username with proper extension i.e -AMIN / -INST / -STF/ -STU';
      } else this.error = 'Please fill username with proper extension i.e -AMIN / -INST / -STF/ -STU';
    
      
    } else {
      this.error = 'Please fill username / Password fields';
    }
  }

}
