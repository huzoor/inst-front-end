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
  public classList: any;
  public subjectList: any;
  public error: any;
  public className: any = '';
  public subjectName: any = '';
  public userName: any = '';
  constructor(private modalService: BsModalService,
    private dataService: DataService) { }

  ngOnInit() {
    AdminLTE.init();
    this.className = new FormControl('', []);
    this.subjectName = new FormControl('', []);
    this.userName = new FormControl('inst1-INST', []);
    this.formFileds();

    // this.classList = [{
    //   id: 1,
    //   className: 'First'
    // }];
    // this.subjectList = [{
    //   id: 1,
    //   subjectName: 'English'
    // }];

    this.getEntitiesList();
  }

  formFileds() {
    this.classForm = new FormGroup({
      className: this.className,
      userName: this.userName,
    });

    this.subjectForm = new FormGroup({
      subjectName: this.subjectName,
      userName: this.userName,
    });
  }

  public openModal(template: TemplateRef<any>) {
    this.className = '';
    this.subjectName = '';
    this.modalRef = this.modalService.show(template, { ignoreBackdropClick: true });
  }

  public editClass(classData, template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template, { ignoreBackdropClick: true });
    this.className = classData.className;
  }

  public editSubject(subjectData, template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template, { ignoreBackdropClick: true });
    this.subjectName = subjectData.subjectName;
  }

  public getEntitiesList(): void {
    this.dataService.getEntitiesList()
      .then((resp) => {
        let res = resp.json()
        if (res.success) {
          this.classList = res.entities[0].Classes;
          this.subjectList = res.entities[0].Subjects;
        } else {
          this.error = resp.json().message;
        }
      }).catch((err) => {
        console.log('err',err)
        this.error = err.json().message;
      });
  }

  public addClass(classForm) {
    if (this.classForm.valid) {
      this.error = '';
      this.dataService.addClass(this.classForm.value)
        .then((resp) => {
          if (resp.json().success) {
            this.className = new FormControl('',[])
            this.modalRef.hide();
            this.getEntitiesList();
          } else {
            this.error = resp.json().message;
          }
        })
        .catch((err) => {
          this.error = err.json().message;
        });
    }
  }

  public addSubject(subjectForm) {
    if (this.subjectForm.valid) {
      this.error = '';
      this.dataService.addSubject(this.subjectForm.value)
        .then((resp) => {
          if (resp.json().success) {
            this.subjectName = new FormControl('',[])
            this.modalRef.hide();
            this.getEntitiesList();
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
