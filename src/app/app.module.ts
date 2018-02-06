import { AdminModule } from './admin/admin.module';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MyDatePickerModule } from 'mydatepicker';

import { DataService } from './shared/data.service';
import { EnsureAuthenticated } from './shared/ensure-authenticated.service';
import { LoginRedirect } from './shared/login-redirect.service';

import { AppComponent } from './app.component';
import { SigninComponent } from './accounts/signin/signin.component';
import { RegistrationComponent } from './accounts/registration/registration.component';

@NgModule({
  declarations: [
    AppComponent,
    SigninComponent,
    RegistrationComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MyDatePickerModule,
    AdminModule
  ],
  providers: [
    DataService,
    EnsureAuthenticated,
    LoginRedirect
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
