import { Component, OnInit } from '@angular/core';
import { DataService } from '../../shared/data.service';

@Component({
  selector: 'app-admin-left-side',
  templateUrl: './admin-left-side.component.html',
  styleUrls: ['./admin-left-side.component.css']
})
export class AdminLeftSideComponent implements OnInit {
public menuList: any;
public userRole: number;
public roleType: String;
public name: String;
public userImage: String;

  constructor(private auth: DataService,) { }

  ngOnInit() {
    /*
    Admin: 100,
    Institute: 101,
    School: 102,
    Staff: 103,
    Student: 104
    */
   this.userRole = parseInt(localStorage.getItem('role'));
   this.name = localStorage.getItem('name');
   this.roleType = localStorage.getItem('roleType');
   this.menuList = require('./left-menu.json');
   this.userImage = localStorage.getItem('logo');

   this.getImageDetails();
  }

  public getImageDetails(){
    const inputDtls = {
      role : parseInt(localStorage.getItem('role'), 10),
      userName : localStorage.getItem('userName'),
    };

    this.auth.getImageDetails(inputDtls).then((resp) => {
      if(resp.json().success) 
        this.userImage = resp.json().logo;
    }).catch((err) => {
      console.log('err',err)
    });
  }

}
