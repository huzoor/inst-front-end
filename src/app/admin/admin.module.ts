import { AdminComponent } from './admin.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ModalModule } from 'ngx-bootstrap';
import { MyDatePickerModule } from 'mydatepicker';
import { TimepickerModule } from 'ngx-bootstrap';

import {
  BreadcrumbModule,
  CalendarModule,
  DropdownModule,
  DataTableModule,
  GrowlModule,
  TreeModule,
  TreeTableModule
} from 'primeng/primeng';

import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing/admin-routing.module';
import { AdminFooterComponent } from './admin-footer/admin-footer.component';
import { AdminLeftSideComponent } from './admin-left-side/admin-left-side.component';
import { AdminHeaderComponent } from './admin-header/admin-header.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AttendanceComponent } from './attendance/attendance.component';
import { InstitutesComponent } from './institutes/institutes.component';
import { InstituteProfileComponent } from './institute-profile/institute-profile.component';
import { SchoolManagementComponent } from './school-management/school-management.component';
import { AcademicSetupComponent } from './academic-setup/academic-setup.component';
import { StaffManagementComponent } from './staff-management/staff-management.component';
import { StudentManagementComponent } from './student-management/student-management.component';
import { LeaveManagementComponent } from './leave-management/leave-management.component';
import { TimelineComponent } from './timeline/timeline.component';
import { TimetableComponent } from './timetable/timetable.component';
import { ExaminationComponent } from './examination/examination.component';
import { StudentAcademicSetupComponent } from './student-academic-setup/student-academic-setup.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { GalleryComponent } from './gallery/gallery.component';
import {FileUploadModule} from 'ng2-file-upload';
import { ChartsModule } from 'ng2-charts';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NonTeachingStaffComponent } from './non-teaching-staff/non-teaching-staff.component';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    ModalModule.forRoot(),
    ReactiveFormsModule,
    MyDatePickerModule,
    TimepickerModule.forRoot(),
    AdminRoutingModule,
    ImageCropperModule,
    FileUploadModule,
    ChartsModule,
    BrowserAnimationsModule,
    DataTableModule,
    ToastrModule.forRoot({timeOut: 2000,
      positionClass: 'toast-top-full-width',
      preventDuplicates: true,}),
    NgxSpinnerModule,
  ],
  declarations: [
    AdminComponent,
    DashboardComponent,
    AdminHeaderComponent,
    AdminLeftSideComponent,
    AdminFooterComponent,
    AttendanceComponent,
    InstitutesComponent,
    InstituteProfileComponent,
    SchoolManagementComponent,
    AcademicSetupComponent,
    StaffManagementComponent,
    StudentManagementComponent,
    LeaveManagementComponent,
    TimelineComponent,
    TimetableComponent,
    ExaminationComponent,
    StudentAcademicSetupComponent,
    GalleryComponent,
    ChangePasswordComponent,
    NonTeachingStaffComponent
  ],
  exports: [AdminComponent]
})
export class AdminModule { }
