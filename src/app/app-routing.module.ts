import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SigninComponent } from './accounts/signin/signin.component';
import { RegistrationComponent } from './accounts/registration/registration.component';

@NgModule({
  imports: [
    RouterModule.forRoot([
      { path: '', redirectTo: 'signin', pathMatch: 'full' },
      { path: 'signin', component: SigninComponent },
      { path: 'registration', component: RegistrationComponent },
    ])
  ],
  declarations: [],
  exports: [ RouterModule]
})
export class AppRoutingModule { }
