import { AdminComponent } from './admin.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ModalModule } from 'ngx-bootstrap';
import { MyDatePickerModule } from 'mydatepicker';

import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing/admin-routing.module';
import { AdminFooterComponent } from './admin-footer/admin-footer.component';
import { AdminLeftSideComponent } from './admin-left-side/admin-left-side.component';
import { AdminHeaderComponent } from './admin-header/admin-header.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StudentsComponent } from './students/students.component';
import { TeachersComponent } from './teachers/teachers.component';
import { ParentsComponent } from './parents/parents.component';
import { AttendanceComponent } from './attendance/attendance.component';
import { InstitutesComponent } from './institutes/institutes.component';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    ModalModule.forRoot(),
    ReactiveFormsModule,
    MyDatePickerModule,
    AdminRoutingModule
  ],
  declarations: [
    AdminComponent,
    DashboardComponent,
    AdminHeaderComponent,
    AdminLeftSideComponent,
    AdminFooterComponent,
    StudentsComponent,
    TeachersComponent,
    ParentsComponent,
    AttendanceComponent,
    InstitutesComponent
  ],
  exports: [AdminComponent]
})
export class AdminModule { }
