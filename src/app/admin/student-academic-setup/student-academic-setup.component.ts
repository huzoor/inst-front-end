import { Component, OnInit, TemplateRef, ElementRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataService } from '../../shared/data.service';
import { ToastrService } from 'ngx-toastr';

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
  public staffList: any[] = [];

  public error: any;
  constructor(private modalService: BsModalService,
    private dataService: DataService,
    private toastr: ToastrService,
    private loadingIndicator: NgxSpinnerService) { }

  ngOnInit() {
    AdminLTE.init();
    this.getStaffDetails();
    this.getSubjectsList();
    this.loadingIndicator.show();
  }
// Staff Setup start
  public getStaffDetails(): void {
    let instituteUserName = localStorage.getItem('instituteUserName');
    let schoolUserName = localStorage.getItem('schoolUserName');
     this.dataService.getStaffList({schoolUserName, instituteUserName})
    .then((resp) => {
      this.loadingIndicator.hide();
      if (resp.json().success) {
        this.staffList = resp.json().staffList;
        console.log(this.staffList);
      } else {
        console.log('Staff Load Failed');
        this.error = 'StaffInfo loading failed..!';
      }
    });
  }

  public selectClass(className): void {
    console.log(className);
  }

  public saveStaff(staffData: any): void {
    console.log(staffData);
  }

  // Staff setup end

  public getClassesList(): Promise<any> {
    // Get instituteUserName from localStorage
    let instituteUserName = localStorage.getItem('instituteUserName');
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
    let instituteUserName = localStorage.getItem('instituteUserName');
     let schoolUserName = localStorage.getItem('schoolUserName');
    let entityType ='subjects';
   this.dataService.getEntitiesList({instituteUserName, entityType })
      .then((resp) => {
        this.loadingIndicator.hide();
        let res = resp.json()
        if (res.success) {
          this.loadingIndicator.hide();
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
                    selected: (isSelected.length > 0),
                    schoolUserName
                  }
                })
              }
            });
          })
        } else this.error = resp.json().message;
        
      }).catch((err) => {
        console.log('err',err);
        this.loadingIndicator.hide();
        this.error = err.json().message;
      });
  }

  public saveSubjects(subjectsInfo): void {
    // Get instituteUserName from localStorage
    let instituteUserName = localStorage.getItem('instituteUserName');
    let schoolUserName = localStorage.getItem('schoolUserName');

    let mappedList: any[] = new Array();
    let filteresList = subjectsInfo.map(i => i.subjects.filter(s=> s.selected)).filter(x => x.length > 0);
    filteresList.map(i => i.map(s=> { if(!mappedList[s]) mappedList.push(s)}));

    console.log(mappedList);
    this.dataService.addAcadamicSetup({ mappedList, instituteUserName, schoolUserName}).then((resp)=>{
      this.loadingIndicator.hide();
        if (resp.json().success) {
          this.error = resp.json().message;
          this.toastr.success(`Academic Setup Added/Updated Successfully`);
        } else this.error = resp.json().message;
    }).catch((err) => {
        console.log('err',err)
        this.error = err.json().message;
      });

  }
}
