import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { LoginRedirect } from './shared/login-redirect.service';

import { SigninComponent } from './accounts/signin/signin.component';
import { RegistrationComponent } from './accounts/registration/registration.component';
import { ForgotPasswordComponent } from './accounts/forgot-password/forgot-password.component';

@NgModule({
  imports: [
    RouterModule.forRoot([
      { path: '', redirectTo: 'signin', pathMatch: 'full' },
      { path: 'signin', component: SigninComponent, canActivate: [LoginRedirect]},
      { path: 'registration', component: RegistrationComponent, canActivate: [LoginRedirect] },
      { path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [LoginRedirect]},
    ])
  ],
  declarations: [],
  exports: [ RouterModule]
})
export class AppRoutingModule { }
