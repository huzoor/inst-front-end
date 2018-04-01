import { Component, OnInit, TemplateRef, ElementRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { DataService } from '../../shared/data.service';
declare var AdminLTE: any;
@Component({
  selector: 'app-student-academic-setup',
  templateUrl: './student-academic-setup.component.html',
  styleUrls: ['./student-academic-setup.component.css']
})
export class StudentAcademicSetupComponent implements OnInit {
  public instituteUserName: FormControl;
  public subjectList: any[] = new Array();
  public error: any;
  constructor(private modalService: BsModalService,
    private dataService: DataService) { }

  ngOnInit() {
    AdminLTE.init();
    this.instituteUserName = new FormControl('', []);
    this.subjectList = [{
      class: "First",
      subjects: [{
        subjectName: "Telugu",
        selected: true
      },
      {
        subjectName: "Englist",
        selected: false
      },
      {
        subjectName: "Maths",
        selected: true
      }]
    },
    {
      class: "Second",
      subjects: [{
        subjectName: "Telugu",
        selected: false
      },
      {
        subjectName: "Englist",
        selected: false
      },
      {
        subjectName: "Maths",
        selected: true
      }]
    }]
  }


  public saveSubjects(subjects): void {
    console.log(subjects)
  }
}
