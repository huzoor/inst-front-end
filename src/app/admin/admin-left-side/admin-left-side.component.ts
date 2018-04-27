import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-left-side',
  templateUrl: './admin-left-side.component.html',
  styleUrls: ['./admin-left-side.component.css']
})
export class AdminLeftSideComponent implements OnInit {
public menuList: any;
public userRole: number = 103;
  constructor() { }

  ngOnInit() {
    /*
    Admin: 100,
    Institute: 101,
    School: 102,
    Staff: 103,
    Student: 104
    */
    this.menuList = require('./left-menu.json');
  }

}
