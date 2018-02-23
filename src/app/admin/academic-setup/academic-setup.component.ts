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
  public className: any;
  public subjectName: any;
  constructor(private modalService: BsModalService,
    private dataService: DataService) { }

  ngOnInit() {
    AdminLTE.init();
    this.className = new FormControl('', []);
    this.subjectName = new FormControl('', []);
    this.formFileds();

    this.classList = [{
      id: 1,
      className: 'First'
    }];
    this.subjectList = [{
      id: 1,
      subjectName: 'English'
    }];
  }

  formFileds() {
    this.classForm = new FormGroup({
      className: this.className
    });

    this.subjectForm = new FormGroup({
      subjectName: this.subjectName
    });
  }

  public openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { ignoreBackdropClick: true });
  }

  public editClass(classData, template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template, { ignoreBackdropClick: true });
    this.className = classData.className;
  }


  public getClassList(): void {
    this.dataService.getClassData()
      .then((resp) => {
        if (resp.json().success) {
          this.classList = resp;
        } else {
          this.error = resp.json().message;
        }
      })
      .catch((err) => {
        this.error = err.json().message;
      });
  }

  public getSubjectList(): void {
    this.dataService.getSubjectData()
      .then((resp) => {
        if (resp.json().success) {
          this.subjectList = resp;
        } else {
          this.error = resp.json().message;
        }
      })
      .catch((err) => {
        this.error = err.json().message;
      });
  }

  public saveClass(classForm) {
    if (this.classForm.valid) {
      this.error = '';
      this.dataService.saveClass(this.classForm.value)
        .then((resp) => {
          if (resp.json().success) {
            this.classForm.reset();
            this.modalRef.hide();
            this.getClassList();
          } else {
            this.error = resp.json().message;
          }
        })
        .catch((err) => {
          this.error = err.json().message;
        });
    }
  }

  public saveSubject(classForm) {
    if (this.classForm.valid) {
      this.error = '';
      this.dataService.saveSubject(this.classForm.value)
        .then((resp) => {
          if (resp.json().success) {
            this.classForm.reset();
            this.modalRef.hide();
            this.getSubjectList();
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
