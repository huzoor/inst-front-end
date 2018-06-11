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
import { AcademicSetupComponent } from '../academic-setup/academic-setup.component';
import { StaffManagementComponent } from '../staff-management/staff-management.component';
import { AttendanceComponent } from '../attendance/attendance.component';
import { StudentManagementComponent } from '../student-management/student-management.component';
import { LeaveManagementComponent } from '../leave-management/leave-management.component';
import { TimelineComponent } from '../timeline/timeline.component';
import { TimetableComponent } from '../timetable/timetable.component';
import { ExaminationComponent } from '../examination/examination.component';
import { StudentAcademicSetupComponent } from '../student-academic-setup/student-academic-setup.component';
import { GalleryComponent } from '../gallery/gallery.component';
import { ChangePasswordComponent } from '../change-password/change-password.component';

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
          },
          {
            path: 'academic-setup',
            component: AcademicSetupComponent,
            canActivate: [EnsureAuthenticated]
          },
          {
            path: 'student-academic-setup',
            component: StudentAcademicSetupComponent,
            canActivate: [EnsureAuthenticated]
          },
          {
            path: 'staff-management',
            component: StaffManagementComponent,
            canActivate: [EnsureAuthenticated]
          },
          {
            path: 'attendance',
            component: AttendanceComponent,
            canActivate: [EnsureAuthenticated]
          },
          {
            path: 'student-management',
            component: StudentManagementComponent,
            canActivate: [EnsureAuthenticated]
          },
          {
            path: 'leave-management',
            component: LeaveManagementComponent,
            canActivate: [EnsureAuthenticated]
          },
          {
            path: 'timeline',
            component: TimelineComponent,
            canActivate: [EnsureAuthenticated]
          },
          {
            path: 'timetable',
            component: TimetableComponent
          },
          {
            path: 'exams',
            component: ExaminationComponent,
            canActivate: [EnsureAuthenticated],
          },
          {
            path: 'change-password',
            component: ChangePasswordComponent,
            canActivate: [EnsureAuthenticated],
          },
          {
            path: 'gallery',
            component: GalleryComponent,
            canActivate: [EnsureAuthenticated],
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
