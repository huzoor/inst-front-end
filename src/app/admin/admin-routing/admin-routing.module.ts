import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { LoginRedirect } from '../../shared/login-redirect.service';
import { EnsureAuthenticated } from '../../shared/ensure-authenticated.service';

import { DashboardComponent } from './../dashboard/dashboard.component';
import { AdminComponent } from './../admin.component';
import { StudentsComponent } from '../students/students.component';
import { InstitutesComponent } from '../institutes/institutes.component';
@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: AdminComponent,
        children: [
          {
            path: '',
            redirectTo: 'dashboard',
            pathMatch: 'full',
            canActivate: [EnsureAuthenticated],
          },
          {
            path: 'dashboard',
            component: DashboardComponent,
            canActivate: [EnsureAuthenticated],
          },
          {
            path: 'institutes',
            component: InstitutesComponent
          }          
        ]
      }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class AdminRoutingModule { }
