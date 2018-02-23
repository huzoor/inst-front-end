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
  public classList: any;
  public subjectsList: any;
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
  }

  formFileds() {
    this.classForm = new FormGroup({
      className: this.className
    });
  }

  public openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { ignoreBackdropClick: true });
  }

  // public onSubmit(instituteform) {
  //   if (this.classForm.valid) {
  //     this.error = '';
  //     this.dataService.addInstitute(this.instituteform.value)
  //       .then((resp) => {
  //         if (resp.json().success) {
  //           this.instituteform.reset();
  //           this.modalRef.hide();
  //           this.getInstitutesList();
  //         } else {
  //           this.error = resp.json().message;
  //         }
  //       })
  //       .catch((err) => {
  //         console.log('Add Inst Err', err);
  //         this.error = err.json().message;
  //       });
  //   }

  // }
}
