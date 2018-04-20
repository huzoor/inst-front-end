import { Component, OnInit, TemplateRef, ElementRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MyDatePickerModule, IMyDpOptions } from 'mydatepicker';
import { daysList, periodTimings } from '../../shared/AppConstants';
import { DataService } from '../../shared/data.service';

declare var AdminLTE: any;
@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.css']
})
export class TimetableComponent implements OnInit {
  public modalRef: BsModalRef;
  public error: any;
  public subjectsList: any;
  public classList: any[];
  public daysList: any[] = daysList;
  public periodTimings: any[] = periodTimings;
  public classForm: FormGroup;
  public timetableForm: FormGroup;
  public subjectCode: FormControl;
  public selectedClass: FormControl;
  public timeTableList: any = '';
  constructor(private dataService: DataService) {
    this.getClassesList();
    
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

  public getClassesList(): void {
    // Get instituteUserName from localStorage
    let instituteUserName = `inst1-INST`;
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
    this.getSubjectsList(selectedClass).then(canLoad=> {
      if(canLoad){
        this.timeTableList = daysList.map( (item, index)=>{
              return {
                dayName: item,
                periodTimings: this.periodTimings.map(p=>{
                  return {
                    periodTime: p.periodTime,
                    periodName: p.periodName,
                    subjectsList: this.subjectsList.map(s=> {
                      return {
                        _id: s._id,
                        subjName:s.subjectName,
                        isSelected: false,
                      }
                    })
                  }
                }),
              }
          });
          console.log(this.timeTableList)
      }
    });
   
    // const getClassTimings = tableList.filter((item) => item.class === selectedClass);
    // if (getClassTimings && getClassTimings.length !== 0) {
    //   this.timeTableList = getClassTimings[0].timetable;
    // }
  };

  public getSubjectsList(classId): Promise<any>  {
    // Get instituteUserName from localStorage
    let instituteUserName = 'inst1-INST';
    let schoolUserName = 'sch1-SCH';
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

  public onSubjectChange(subj, day, periodName){
    console.log(subj, day, periodName);

    this.timeTableList.filter(i => {
        if(i.dayName === day) {
          i.periodTimings.filter(p => {
            if(p.periodName === periodName){
              p.subjectsList.filter( s=> {
                    if(s._id === subj)
                      s.isSelected = true;
                    else s.isSelected = false;
                })
            }
          })
        }
      });
      console.log(this.timeTableList);
  }

  public saveInfo(info){
    console.log(info);
  }
}
