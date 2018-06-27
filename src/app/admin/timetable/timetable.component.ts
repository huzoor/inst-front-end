import { Component, OnInit, TemplateRef, ElementRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MyDatePickerModule, IMyDpOptions } from 'mydatepicker';
import { daysList } from '../../shared/AppConstants';
import { DataService } from '../../shared/data.service';

declare var AdminLTE: any;
@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.css']
})
export class TimetableComponent implements OnInit {
  public loadingIndicator: Promise<any>;
  public modalRef: BsModalRef;
  public error: any = '';
  public subjectsList: any;
  public classList: any[];
  public daysList: any[] = daysList;
  public hoursList: any[];
  public classForm: FormGroup;
  public timetableForm: FormGroup;
  public subjectCode: FormControl;
  public selectedClass: FormControl;
  public timeTableList: any = '';
  public timetableInfo: any = [];
  constructor(private dataService: DataService) {
    this.getClassesList();
    this.getHoursList();
   }

  ngOnInit() {
    AdminLTE.init();
    this.selectedClass = new FormControl('', []);
    this.subjectCode = new FormControl('', []);
    this.classForm = new FormGroup({
      selectedClass: this.selectedClass
    });
    this.timetableForm = new FormGroup({
      subjectCode: this.subjectCode
    });
  }

  public getHoursList(): void {
    // Get instituteUserName from localStorage
    let instituteUserName = localStorage.getItem('instituteUserName');
    // let entityType = `classes`;

    this.dataService.getHoursList({ instituteUserName })
      .then((resp) => {
        let res = resp.json()
        if (res.success) {
          this.hoursList = res.hoursList;
        } else this.error = resp.json().message;

      }).catch((err) => {
        console.log('err', err)
        this.error = err.json().message;
      });
  }

  public getClassesList(): void {
    // Get instituteUserName from localStorage
    let instituteUserName = localStorage.getItem('instituteUserName');
    let entityType = `classes`;

    this.dataService.getEntitiesList({ instituteUserName, entityType })
      .then((resp) => {
        let res = resp.json()
        if (res.success) {
          this.classList = res.Classes;
        } else this.error = resp.json().message;

      }).catch((err) => {
        console.log('err', err)
        this.error = err.json().message;
      });
  }
  
  public getClassWiseTimeTable(selectedClass): void {
    this.error = '';
    let instituteUserName = localStorage.getItem('instituteUserName');
    let schoolUserName = localStorage.getItem('schoolUserName');
   this.loadingIndicator = this.getSubjectsList(selectedClass).then(canLoad=> {
      if(canLoad){
        this.timeTableList = daysList.map( (item, index)=>{
              return {
                dayName: item,
                hoursList: this.hoursList.map(h=>{
                  return {
                    startTime: h.startTime,
                    endTime: h.endTime,
                    hourName: h.hourName,
                    subjectsList: this.subjectsList.map(s=> {
                      let isSelected = false;
                      h.associatedWith.filter(ass => {
                        if(ass.subjectId == s._id && item == ass.dayName)
                          isSelected = true
                      })
                      return {
                        _id: s._id,
                        hourId: h._id,                        
                        subjectId: s._id,
                        subjName:s.subjectName,
                        isSelected,
                        dayName: item,
                        instituteUserName,
                        schoolUserName,
                        classId: selectedClass,
                      }
                    })
                  }
                }),
              }
          });
          console.log(this.timeTableList)
      }
    });
   
  };

  public getSubjectsList(classId): Promise<any>  {
    // Get instituteUserName from localStorage
    let instituteUserName = localStorage.getItem('instituteUserName');
    let schoolUserName = localStorage.getItem('schoolUserName');
    return this.dataService.getEntitiesList({ instituteUserName, classId })
      .then((resp) => {
        let res = resp.json()
        if (res.success) {
          this.subjectsList = res.Subjects;
          return true;
        } else {
          this.error = resp.json().message;
          return false;
        }

      }).catch((err) => {
        console.log('err', err)
        this.error = err.json().message;
        return false;
      });
  }

  public onSubjectChange(subj, day, hourName){
    console.log(subj, day, hourName);
    this.timeTableList.filter(i => {
        if(i.dayName === day) {
          i.hoursList.filter(p => {
            if(p.hourName === hourName){
              p.subjectsList.filter( s=> {
                    if(s._id === subj)
                      s.isSelected = true;
                    else s.isSelected = false;
                })
            }
          })
        }
      });
      console.log(this.timeTableList)
  }

  public saveTimeTableInfo(){

    // Get instituteUserName from localStorage
    let instituteUserName = localStorage.getItem('instituteUserName');
    let schoolUserName = localStorage.getItem('schoolUserName');
    let cnt =  this.timeTableList.length;

    let timetableInfo: any[] = new Array();

    this.timeTableList.map((i,index) =>{
      i.hoursList.map(h =>{
        h.subjectsList.map(s =>{
            if(s.isSelected){
              timetableInfo.push(s); 
            }
        })	
      })
    });
  
    let processedInfo = {
      instituteUserName, schoolUserName, 
      selectedClass: this.selectedClass.value, 
      timetableInfo
    };

    this.dataService.saveTimeTableInfo(processedInfo)
    .then((resp) => {
    console.log(resp);
    if (resp.json().success) {
      this.error = resp.json().message;
      this.classForm.reset();
      this.timetableForm.reset();
      this.timeTableList = [];
    } else this.error = resp.json().message;

    }).catch((err) =>  {
    console.log(err);
    this.error = err;
    });
  
  }
}
