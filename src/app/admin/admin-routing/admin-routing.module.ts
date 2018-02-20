import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { LoginRedirect } from '../../shared/login-redirect.service';
import { EnsureAuthenticated } from '../../shared/ensure-authenticated.service';

import { DashboardComponent } from './../dashboard/dashboard.component';
import { AdminComponent } from './../admin.component';
import { InstitutesComponent } from '../institutes/institutes.component';
import { InstituteProfileComponent } from '../institute-profile/institute-profile.component';
import { SchoolManagementComponent } from '../school-management/school-management.component';
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
            component: InstitutesComponent,
            canActivate: [EnsureAuthenticated],
          },
          {
            path: 'institute-profile/:id',
            component: InstituteProfileComponent,
            canActivate: [EnsureAuthenticated]
          },
          {
            path: 'school-management',
            component: SchoolManagementComponent,
            canActivate: [EnsureAuthenticated]
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
