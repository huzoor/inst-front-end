import { Component, OnInit, TemplateRef, ElementRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MyDatePickerModule, IMyDpOptions } from 'mydatepicker';
import { ToastrService } from 'ngx-toastr';

import { DataService } from '../../shared/data.service';
declare var AdminLTE: any;
@Component({
  selector: 'app-academic-setup',
  templateUrl: './academic-setup.component.html',
  styleUrls: ['./academic-setup.component.css']
})
export class AcademicSetupComponent implements OnInit {
  public modalRef: BsModalRef;
  public classForm: FormGroup;
  public subjectForm: FormGroup;
  public instituteUserName: FormControl;
  public schoolUserName: any = '';
  public classList: any[] = new Array();
  public subjectList: any[] = new Array();
  public error: String = new String('');
  public className: any = '';
  public class_ID: any = '';
  public subjectName: any = '';
  public subject_ID: any = '';
  public hour_ID: any = '';
  public showUpdateButton: boolean = false;

  public hourList: any[] = new Array();
  public hourForm: FormGroup;
  public hourName: any;
  public startTime: any;
  public endTime: any;
  public userRole: number;
  public deleteRecord: any;
  public entityType: any;
  public disableButton: boolean = false;
  constructor(private modalService: BsModalService,
    private dataService: DataService,
    private toastr: ToastrService) { }

  ngOnInit() {
    AdminLTE.init();
    this.userRole = parseInt(localStorage.getItem('role'));
    this.className = new FormControl('', []);
    this.subjectName = new FormControl('', []);
    this.instituteUserName = new FormControl('', []);
    this.schoolUserName = new FormControl('', []);

    this.hourName = new FormControl('', []);
    this.startTime = new FormControl('', []);
    this.endTime = new FormControl('', []);
    this.formFileds();
    this.getClassesList();
    this.getSubjectsList();
    this.getHoursList();
  }

  formFileds() {
    this.classForm = new FormGroup({
      className: this.className
    });

    this.subjectForm = new FormGroup({
      subjectName: this.subjectName
    });

    this.hourForm = new FormGroup({
      hourName: this.hourName,
      startTime: this.startTime,
      endTime: this.endTime
    });
  }

  public getClassesList(): void {
    // Get instituteUserName from localStorage
    let instituteUserName = localStorage.getItem('instituteUserName');
    let entityType ='classes';
    this.dataService.getEntitiesList({instituteUserName, entityType })
      .then((resp) => {
        let res = resp.json()
        if (res.success) {
          this.classList = res.Classes;
        } else this.error = resp.json().message;
        
      }).catch((err) => {
        console.log('err',err);
        this.error = err.json().message;
        this.toastr.error(err.json().message);
      });
  }
 
  public getSubjectsList(): void {
    // Get instituteUserName from localStorage
    let instituteUserName = localStorage.getItem('instituteUserName');
    let entityType ='subjects';
    this.dataService.getEntitiesList({instituteUserName, entityType })
      .then((resp) => {
        let res = resp.json()
        if (res.success) {
          this.subjectList = res.Subjects;
        } else this.error = resp.json().message;
        
      }).catch((err) => {
        console.log('err',err)
        this.error = err.json().message;
        this.toastr.error(err.json().message);
      });
  }

  public getHoursList(): void {
    // Get instituteUserName from localStorage
    let instituteUserName = localStorage.getItem('instituteUserName');
    this.dataService.getHoursList({instituteUserName })
      .then((resp) => {
        let res = resp.json()
        if (res.success) {
          this.hourList = res.hoursList;
        } else this.error = resp.json().message;
        
      }).catch((err) => {
        console.log('err',err)
        this.error = err.json().message;
        this.toastr.error(err.json().message);
      });
  }

  public openModal(template: TemplateRef<any>) {
    this.disableButton = false;
    this.className = '';
    this.subjectName = '';
    this.schoolUserName = '';
    this.hourName = '';
    this.startTime = '';
    this.endTime = '';
    this.error = '';
    this.showUpdateButton = false;
    
    this.hourForm.reset();
    this.modalRef = this.modalService.show(template, { ignoreBackdropClick: true });
  }

  public editClass(classData, template: TemplateRef<any>): void {
    console.log('classData', classData);
    this.modalRef = this.modalService.show(template, { ignoreBackdropClick: true });
    this.className = classData.className;
    this.class_ID = classData._id;
    this.showUpdateButton = true;
  }

  public editSubject(subjectData, template: TemplateRef<any>): void {
    console.log('subjectData', subjectData)
    this.modalRef = this.modalService.show(template, { ignoreBackdropClick: true });
    this.subjectName = subjectData.subjectName;
    this.subject_ID = subjectData._id;
    this.showUpdateButton = true;
  }

  public editHour(hourData, template: TemplateRef<any>): void {
    this.error = '';
    console.log(hourData)
    this.modalRef = this.modalService.show(template, { ignoreBackdropClick: true });
    // this.hourForm.setValue(hourData);
    this.hour_ID = hourData._id;
    this.hourName = hourData.hourName;
    this.startTime = hourData.startTime;
    this.endTime = hourData.endTime;
    this.showUpdateButton = true;
  }

  public addClass(classForm) {
    this.disableButton = true;
    if (this.classForm.valid) {
      this.error = '';
      this.classForm.value.instituteUserName = localStorage.getItem('instituteUserName');
      this.classForm.value.schoolUserName = localStorage.getItem('schoolUserName');
      this.classForm.value.fromMode = `create`;
      
      this.dataService.addClass(this.classForm.value)
        .then((resp) => {
          if (resp.json().success) {
            this.className = new FormControl('',[])
            this.modalRef.hide();
            this.getClassesList();
            this.toastr.success('Class added successfully');
          } else 
            this.error = resp.json().message;
            this.toastr.error('Unabled to add subject');
        })
        .catch((err) => {
          this.error = err.json().message;
          this.toastr.error('Unabled to add class');
        });
    }
  }

  public addSubject(subjectForm) {
    this.disableButton = true;
    if (this.subjectForm.valid) {
      this.error = '';
      this.subjectForm.value.instituteUserName = localStorage.getItem('instituteUserName');
      this.subjectForm.value.schoolUserName = localStorage.getItem('schoolUserName');
      this.subjectForm.value.fromMode = `create`;
     
      this.dataService.addSubject(this.subjectForm.value)
        .then((resp) => {
          if (resp.json().success) {
            this.subjectName = new FormControl('',[])
            this.modalRef.hide();
            this.getSubjectsList();
            this.toastr.success('Subject added successfully');
          } else {
            this.error = resp.json().message;
            this.toastr.error('Unabled to add subject');
          }
        })
        .catch((err) => {
          this.error = err.json().message;
          this.toastr.error('Unabled to add subject');
        });
    }
  }

  updateClass(classForm): void {
    console.log(classForm.value);
    if (this.classForm.valid) {
      this.error = '';
      this.classForm.value.instituteUserName = localStorage.getItem('instituteUserName');
      this.classForm.value.schoolUserName = localStorage.getItem('schoolUserName');
      this.classForm.value.fromMode = `update`;
      this.classForm.value.class_ID = this.class_ID;
    
      this.dataService.addClass(this.classForm.value)
        .then((resp) => {
          if (resp.json().success) {
            this.className = new FormControl('',[])
            this.modalRef.hide();
            this.getClassesList();
            this.toastr.success('Class updated successfully');
          } else 
            this.error = resp.json().message;
            this.toastr.error('Unabled to add class');
        })
        .catch((err) => {
          this.error = err.json().message;
          this.toastr.error('Unabled to add class');
        });
    }
  }

  updateSubject(subjectForm): void {
    console.log(subjectForm.value);
    if (this.subjectForm.valid) {
      this.error = '';
      this.subjectForm.value.instituteUserName = localStorage.getItem('instituteUserName');
      this.subjectForm.value.schoolUserName = localStorage.getItem('schoolUserName');
      this.subjectForm.value.fromMode = `update`;
      this.subjectForm.value.subject_ID = this.subject_ID;

      this.dataService.addSubject(this.subjectForm.value)
        .then((resp) => {
          if (resp.json().success) {
            this.subjectName = new FormControl('',[])
            this.modalRef.hide();
            this.getSubjectsList();
            this.toastr.success('Subject updated successfully');
          } else {
            this.error = resp.json().message;
            this.toastr.error('Unabled to update subject');
          }
        })
        .catch((err) => {
          this.error = err.json().message;
          this.toastr.error('Unabled to update subject');
        });
    }
  }

  public addHour(hourForm) {
    console.log(hourForm.value);
    this.disableButton = true;
    if (this.hourForm.valid) {
      this.error = '';
      this.hourForm.value.instituteUserName = localStorage.getItem('instituteUserName');
      this.hourForm.value.schoolUserName = localStorage.getItem('schoolUserName');
      this.hourForm.value.fromMode = `create`;
      this.dataService.addNewHour(this.hourForm.value)
        .then((resp) => {
          if (resp.json().success) {
            this.hourName = new FormControl('',[])
            this.startTime = new FormControl('',[])
            this.endTime = new FormControl('',[])
            this.getHoursList();
            this.modalRef.hide();
            this.toastr.success('Hours added successfully');
          } else {
            this.error = resp.json().message;
            this.toastr.error('Unabled to add hours');
          }
        })
        .catch((err) => {
          this.error = err.json().message;
          this.toastr.error('Unabled to add hours');
        });
    }
  }

  updateHour(hourForm): void {
    console.log(hourForm.value);
    if (this.hourForm.valid) {
      this.error = '';
      this.hourForm.value.instituteUserName = localStorage.getItem('instituteUserName');
      this.hourForm.value.schoolUserName = localStorage.getItem('schoolUserName');
      this.hourForm.value.fromMode = `update`;

      this.startTime = hourForm.startTime;
      this.endTime = hourForm.endTime;
  
      this.hourForm.value.hour_ID = this.hour_ID;
      this.dataService.addNewHour(this.hourForm.value)
        .then((resp) => {
          if (resp.json().success) {
            this.subjectName = new FormControl('',[])
            this.modalRef.hide();
            this.getHoursList();
            this.toastr.success('Hours updated successfully');
          } else {
            this.error = resp.json().message;
            this.toastr.error('Unabled to update hours');
          }
        })
        .catch((err) => {
          console.log('err',err);
          let parsedErr = err.json();
          this.error = parsedErr.message;
          this.startTime = parsedErr.hour.startTime;
          this.endTime = parsedErr.hour.endTime;
          this.toastr.error('Unable to update hours');
        });
    }
  }
  
  public removeEntity(template: TemplateRef<any>, deleteData, type) {
    this.modalRef = this.modalService.show(template, { ignoreBackdropClick: true });
    this.deleteRecord = deleteData;
    this.entityType = type;
  };
  

  deleteEntity(EntityInfo, entityType){
    const endPoint = `remove${entityType}`;
    this.modalRef.hide();
    this.dataService.removeInstance({_id: EntityInfo._id}, endPoint)
    .then((resp) => {
      if (resp.json().success) {
        this.getClassesList();
        this.getSubjectsList();
        this.getHoursList();
        this.modalRef.hide();
        this.toastr.success(`${entityType} deleted successfully`);
      } else {
        this.error = resp.json().message;
        this.toastr.error(`Unable to delete ${entityType}`);
      }
    })
    .catch((err) => {
      console.log('Remove Inst Err', err);
      this.error = err.json().message;
      this.toastr.error(`Unable to delete ${entityType}`);
    });
  }

}
