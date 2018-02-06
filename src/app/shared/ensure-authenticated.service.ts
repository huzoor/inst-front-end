import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { DataService } from './data.service';

@Injectable()
export class EnsureAuthenticated implements CanActivate {
  constructor(private auth: DataService, private router: Router) {}
  canActivate(): boolean {
    if (localStorage.getItem('token')) {
      return true;
    }
    else {
      this.router.navigate(['/signin']);
      return false;
    }
  }
}