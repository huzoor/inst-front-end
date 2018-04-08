import { Component, OnInit, TemplateRef, ElementRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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
  public error: any;
  public className: any = '';
  public class_ID: any = '';
  public subjectName: any = '';
  public subject_ID: any = '';
  public showUpdateButton: boolean = false;
  constructor(private modalService: BsModalService,
    private dataService: DataService) { }

  ngOnInit() {
    AdminLTE.init();
    this.className = new FormControl('', []);
    this.subjectName = new FormControl('', []);
    this.instituteUserName = new FormControl('', []);
    this.schoolUserName = new FormControl('', []);
    this.formFileds();
    this.getClassesList();
    this.getSubjectsList();
  }

  formFileds() {
    this.classForm = new FormGroup({
      className: this.className
    });

    this.subjectForm = new FormGroup({
      subjectName: this.subjectName
    });
  }

  public getClassesList(): void {
    // Get instituteUserName from localStorage
    let instituteUserName = 'inst1-INST';
    let entityType ='classes';
    this.dataService.getEntitiesList({instituteUserName, entityType })
      .then((resp) => {
        let res = resp.json()
        if (res.success) {
          this.classList = res.Classes;
        } else this.error = resp.json().message;
        
      }).catch((err) => {
        console.log('err',err)
        this.error = err.json().message;
      });
  }
 
  public getSubjectsList(): void {
    // Get instituteUserName from localStorage
    let instituteUserName = 'inst1-INST';
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
      });
  }

  public openModal(template: TemplateRef<any>) {
    this.className = '';
    this.subjectName = '';
    this.schoolUserName = '';
    this.showUpdateButton = false;
    this.modalRef = this.modalService.show(template, { ignoreBackdropClick: true });
  }

  public editClass(classData, template: TemplateRef<any>): void {
    console.log('classData', classData)
    this.modalRef = this.modalService.show(template, { ignoreBackdropClick: true });
    this.className = classData.className;
    this.class_ID = classData._id;
    this.showUpdateButton = true;
  }

  public editSubject(subjectData, template: TemplateRef<any>): void {
    console.log('classData', subjectData)
    this.modalRef = this.modalService.show(template, { ignoreBackdropClick: true });
    this.subjectName = subjectData.subjectName;
    this.subject_ID = subjectData._id;
    this.showUpdateButton = true;
  }

  public addClass(classForm) {
    if (this.classForm.valid) {
      this.error = '';
      this.classForm.value.instituteUserName = 'inst1-INST';
      this.classForm.value.schoolUserName = 'sch1-SCH';
      this.classForm.value.fromMode = `create`;
      
      this.dataService.addClass(this.classForm.value)
        .then((resp) => {
          if (resp.json().success) {
            this.className = new FormControl('',[])
            this.modalRef.hide();
            this.getClassesList();
          } else 
            this.error = resp.json().message;
          
        })
        .catch((err) => {
          this.error = err.json().message;
        });
    }
  }

  public addSubject(subjectForm) {
    if (this.subjectForm.valid) {
      this.error = '';
      this.subjectForm.value.instituteUserName = 'inst1-INST';
      this.subjectForm.value.fromMode = `create`;
     
      this.dataService.addSubject(this.subjectForm.value)
        .then((resp) => {
          if (resp.json().success) {
            this.subjectName = new FormControl('',[])
            this.modalRef.hide();
            this.getSubjectsList();
          } else {
            this.error = resp.json().message;
          }
        })
        .catch((err) => {
          this.error = err.json().message;
        });
    }
  }

  updateClass(classForm): void {
    console.log(classForm.value);
    if (this.classForm.valid) {
      this.error = '';
      this.classForm.value.instituteUserName = 'inst1-INST';
      this.classForm.value.schoolUserName = 'sch1-SCH';
      this.classForm.value.fromMode = `update`;
      this.classForm.value.class_ID = this.class_ID;
    
      this.dataService.addClass(this.classForm.value)
        .then((resp) => {
          if (resp.json().success) {
            this.className = new FormControl('',[])
            this.modalRef.hide();
            this.getClassesList();
          } else 
            this.error = resp.json().message;
          
        })
        .catch((err) => {
          this.error = err.json().message;
        });
    }
  }

  updateSubject(subjectForm): void {
    console.log(subjectForm.value);
    if (this.subjectForm.valid) {
      this.error = '';
      this.subjectForm.value.instituteUserName = 'inst1-INST';
      this.subjectForm.value.fromMode = `update`;
      this.subjectForm.value.subject_ID = this.subject_ID;

      this.dataService.addSubject(this.subjectForm.value)
        .then((resp) => {
          if (resp.json().success) {
            this.subjectName = new FormControl('',[])
            this.modalRef.hide();
            this.getSubjectsList();
          } else {
            this.error = resp.json().message;
          }
        })
        .catch((err) => {
          this.error = err.json().message;
        });
    }
  }

}
