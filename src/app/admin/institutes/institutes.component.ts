import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
declare var AdminLTE: any;
@Component({
  selector: 'app-institutes',
  templateUrl: './institutes.component.html',
  styleUrls: ['./institutes.component.css']
})
export class InstitutesComponent implements OnInit {
  public formGroup: FormGroup;
  public modalRef: BsModalRef;
  public myform: FormGroup;
  public instituteName: FormControl;
  constructor(private modalService: BsModalService,
    ) { }

  ngOnInit() {
    AdminLTE.init();
    this.createFormControls();
    this.createForm();
  }
  createForm() {
    this.myform = new FormGroup({
      instituteName: this.instituteName
    });
  }

  public openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
  createFormControls() {
    this.instituteName = new FormControl('', [
    ]);
  }
  public onSubmit(myForm) {
    console.log(myForm.value);
  }
}
