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
  public subjsList: any[] = new Array();
  public classList: any[] = new Array();
  public error: any;
  constructor(private modalService: BsModalService,
    private dataService: DataService) { }

  ngOnInit() {
    AdminLTE.init();
    this.getSubjectsList();
  }

  public getClassesList(): Promise<any> {
    // Get instituteUserName from localStorage
    let instituteUserName = 'inst1-INST';
    // let schoolUserName = `sch1-SCH`;
    let entityType ='classes';

    return this.dataService.getEntitiesList({instituteUserName, entityType })
      .then((resp) => {
        let res = resp.json()
        if (res.success) {
          this.classList = res.Classes;
          return true;
        } else {
          this.error = resp.json().message;
          return false;
        }
        
      }).catch((err) => {
        console.log('err',err)
        this.error = err.json().message;
        return false;
      });
  }

  public getSubjectsList(): void {
    // Get instituteUserName from localStorage
    let instituteUserName = 'inst1-INST';
     let schoolUserName = `sch1-SCH`;
    let entityType ='subjects';
    this.dataService.getEntitiesList({instituteUserName, entityType })
      .then((resp) => {
        let res = resp.json()
        if (res.success) {
          this.subjsList = res.Subjects;
          this.getClassesList().then((calLoad)=>{
            this.subjectList = this.classList.map(item=>{
              
              return {
                class: item.className,
                subjects: this.subjsList.map(i=> { 
                  let isSelected =  i.associatedWith.filter(i => i.classId === item._id )
                  return { 
                    classID: item._id, 
                    subjectID: i._id, 
                    subjectName: i.subjectName, 
                    // selected: i.associatedWith.includes(item._id),
                    selected: (isSelected.length > 0),
                    schoolUserName
                  }
                })
              }
            })
          })
        } else this.error = resp.json().message;
        
      }).catch((err) => {
        console.log('err',err)
        this.error = err.json().message;
      });
  }

  public loadTimeTable(){

  }
  public saveSubjects(subjectsInfo): void {
    // Get instituteUserName from localStorage
    let instituteUserName = `inst1-INST`;
    let schoolUserName = `sch1-SCH`;

    let mappedList: any[] = new Array();
    let filteresList = subjectsInfo.map(i => i.subjects.filter(s=> s.selected)).filter(x => x.length > 0);
    filteresList.map(i => i.map(s=> { if(!mappedList[s]) mappedList.push(s)}));

    console.log(mappedList);
    this.dataService.setTimeTable({ mappedList, instituteUserName, schoolUserName}).then((resp)=>{
        if (resp.json().success) {
          this.loadTimeTable();
          this.error = resp.json().message;
        } else this.error = resp.json().message;
    }).catch((err) => {
        console.log('err',err)
        this.error = err.json().message;
      });

  }
}
