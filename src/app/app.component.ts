import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'app';
  body: HTMLBodyElement = document.getElementsByTagName('body')[0];
  ngOnInit() {
    // add the the body classes
    this.body.classList.add('login-page');
  }

   ngOnDestroy() {
    // remove the the body classes
    this.body.classList.remove('login-page');
  }

}
