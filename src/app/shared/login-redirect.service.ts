import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { DataService } from './data.service';

@Injectable()
export class LoginRedirect implements CanActivate {
  constructor(private auth: DataService, private router: Router) {}
  canActivate(): boolean {
    if (localStorage.getItem('token')) {
      this.router.navigate(['/dashboard']);
      return false;
    }
    else {
      return true;
    }
  }
}