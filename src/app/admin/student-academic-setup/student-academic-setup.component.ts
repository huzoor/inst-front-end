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
  public classListStf: any[] = new Array();
  public classListStfForSave: any[] = new Array();
  public staffList: any[] = [];
  public disableSave: boolean = false;;
  public selectedlist: any = [];
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
    let instituteUserName = localStorage.getItem('instituteUserName'),
        schoolUserName = localStorage.getItem('schoolUserName'),
        staffRole='Teaching';

     this.dataService.getStaffList({schoolUserName, instituteUserName, staffRole})
    .then((resp) => {
      this.loadingIndicator.hide();
      if (resp.json().success) {
        this.staffList = resp.json().staffList;
        this.getClassesList().then((calLoad)=>{
          console.log('classListStf',this.classList, this.staffList);
          this.classListStf = this.staffList.map(item =>{
            return {
              staffName: item.staffName,
              staffID: item._id,
              classes: this.classList.map(i=> { 
                let isSelected =  i.associatedWith.filter(i => i.staffId === item._id );
                return { 
                  staffID: item._id, 
                  classID: i._id, 
                  className: i.className, 
                  selected: (isSelected.length > 0),
                  schoolUserName
                }
              })
            }
          }).map( (subItem, index) => {
             let isItemSelected =  subItem.classes.filter(i => i.selected);
            //  console.log('isItemSelected', isItemSelected, subItem)
             if(isItemSelected.length > 0) this.classListStfForSave[index] =  subItem
            //  this.classListStfForSave[index] =  subItem

            return subItem
          });
          console.log('classListStf', this.classListStf)
        })
        
      } else {
        console.log('Staff Load Failed');
        this.error = 'StaffInfo loading failed..!';
      }
    });
    // this.dataService.getStaffList({ schoolUserName, instituteUserName })
    //   .then((resp) => {
    //     this.loadingIndicator.hide();
    //     if (resp.json().success) {
    //       this.staffList = resp.json().staffList;
    //     } else {
    //       console.log('Staff Load Failed');
    //       this.error = 'StaffInfo loading failed..!';
    //     }
    //   });
  }

  public selectClass(className, index): void {
    this.classListStfForSave[index] = {
      ...this.classListStf[index],
      classes: this.classListStf[index].classes.map(i=> {
        let selected = (i.className == className);
        return {
          ...i,
          selected
        }
      })
    }
    
    console.log(className, this.classListStfForSave);
  }

  public saveStaff(staffData: any): void {
    console.log(this.classListStfForSave);
      // Get instituteUserName from localStorage
      let instituteUserName = localStorage.getItem('instituteUserName');
      let schoolUserName = localStorage.getItem('schoolUserName');
  
      let mappedList: any[] = new Array();
      let filteresList = this.classListStfForSave.map(i => i.classes.filter(s=> s.selected)).filter(x => x.length > 0);
      filteresList.map(i => i.map(s=> { if(!mappedList[s]) mappedList.push(s)}));
  
      console.log(mappedList);
      this.dataService.addStaffAcadamicSetup({ mappedList, instituteUserName, schoolUserName}).then((resp)=>{
        this.loadingIndicator.hide();
          if (resp.json().success) {
            this.error = resp.json().message;
            this.toastr.success(`Staff Setup Added/Updated Successfully`);
          } else this.error = resp.json().message;
      }).catch((err) => {
          console.log('err',err)
          this.toastr.error(`Staff Setup Added/Updated Error`);
          this.error = err.json().message;
        });


  }

  // Staff setup end

  public getClassesList(): Promise<any> {
    // Get instituteUserName from localStorage
    let instituteUserName = localStorage.getItem('instituteUserName');
    // let schoolUserName = `sch1-SCH`;
    let entityType = 'classes';

    return this.dataService.getEntitiesList({ instituteUserName, entityType })
      .then((resp) => {
        let res = resp.json()
        if (res.success) {
          this.classList = res.Classes;
          // this.classListStf = res.Classes;
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

  public getSubjectsList(): void {
    // Get instituteUserName from localStorage
    let instituteUserName = localStorage.getItem('instituteUserName');
    let schoolUserName = localStorage.getItem('schoolUserName');
    let entityType ='subjects';
    this.loadingIndicator.hide();
    this.dataService.getEntitiesList({ instituteUserName, entityType })
      .then((resp) => {
        this.loadingIndicator.hide();
        let res = resp.json()
        if (res.success) {
          this.subjsList = res.Subjects;
          this.getClassesList().then((calLoad)=>{
            let classesList = [...this.classList];
            this.subjectList = classesList.map(item=>{
              return {
                class: item.className,
                subjects: this.subjsList.map(i => {
                  let isSelected = i.associatedWith.filter(i => (i.classId === item._id && i.schoolUserName == schoolUserName));
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
            //Enabling save button if atleast one subject is selected
            this.subjectList.forEach(element => {
              element.subjects.filter(sublist => {
                if (sublist.selected) {
                  this.selectedlist.push(sublist.subjectName);
                  this.disableSave = false;
                }
              });
            });
          })
        } else this.error = resp.json().message;

      }).catch((err) => {
        console.log('err', err);
        this.loadingIndicator.hide();
        this.error = err.json().message;
      });
  }

  public getSelectedSubject(subjectList): void {
    //Push & pop based on selected checkbox
    if (subjectList.selected === true) {
      this.selectedlist.push(subjectList.subjectName);
    } else {
      this.selectedlist.splice(this.selectedlist.indexOf(subjectList.classID && subjectList.subjectName), 1);
    }
    //Enabling and disabling save button based on selected list
    if (this.selectedlist.length === 0) {
      this.disableSave = true;
    } else {
      this.disableSave = false;
    }
  }

  public saveSubjects(subjectsInfo): void {
    // Get instituteUserName from localStorage
    let instituteUserName = localStorage.getItem('instituteUserName');
    let schoolUserName = localStorage.getItem('schoolUserName');
    let mappedList: any[] = new Array();
    let filteresList = subjectsInfo.map(i => i.subjects.filter(s => s.selected)).filter(x => x.length > 0);
    console.log(subjectsInfo);
    filteresList.map(i => i.map(s => {
      if (!mappedList[s])
        mappedList.push(s)
    }));

    this.dataService.addAcadamicSetup({ mappedList, instituteUserName, schoolUserName }).then((resp) => {
      this.loadingIndicator.hide();
      if (resp.json().success) {
        this.error = resp.json().message;
        this.toastr.success(`Academic Setup Added/Updated Successfully`);
      } else this.error = resp.json().message;
    }).catch((err) => {
      console.log('err', err)
      this.error = err.json().message;
    });

  }
}
