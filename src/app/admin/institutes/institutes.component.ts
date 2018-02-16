import { Component, OnInit, TemplateRef, ElementRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MyDatePickerModule, IMyDpOptions } from 'mydatepicker';
//import { Ng4FilesService, Ng4FilesConfig, Ng4FilesStatus, Ng4FilesSelected } from 'angular4-files-upload';

import { DataService } from '../../shared/data.service';
declare var AdminLTE: any;
const date = new Date();
@Component({
  selector: 'app-institutes',
  templateUrl: './institutes.component.html',
  styleUrls: ['./institutes.component.css']
})
export class InstitutesComponent implements OnInit {
  public instituteList: any = require('./institute.json');
  public placeholder = 'mm/dd/yyyy';
  public modalRef: BsModalRef;
  public instituteform: FormGroup;
  public instituteName: FormControl;
  public selectedLogo: any;
  public imageError: boolean;
  public logo: FormControl;
  public address: FormControl;
  public code: FormControl;
  public registeredDate: FormControl;
  public state: FormControl;
  public city: FormControl;
  public district: FormControl;
  public country: FormControl;
  public name: FormControl;
  public userName: FormControl;
  public email: FormControl;
  public mobile: FormControl;
  public error: any;
  // private configImage: Ng4FilesConfig = {
  //   acceptExtensions: ['jpg', 'jpeg', 'png'],
  //   maxFilesCount: 1
  // };
  constructor(private modalService: BsModalService,private eleRef: ElementRef, private auth: DataService ) { }

  ngOnInit() {
    AdminLTE.init();
    this.instituteName = new FormControl('', []);
    this.logo = new FormControl('', []);
    this.address = new FormControl('', []);
    this.code = new FormControl('', []);
    this.registeredDate = new FormControl('', []);
    this.state = new FormControl('', []);
    this.city = new FormControl('', []);
    this.district = new FormControl('', []);
    this.country = new FormControl('', []);
    this.name = new FormControl('', []);
    this.userName = new FormControl('', []);
    this.email = new FormControl('', []);
    this.mobile = new FormControl('', []);
   // this.ng4FilesService.addConfig(this.configImage, 'institute-logo');
    this.formFileds();
  }
  formFileds() {
    this.instituteform = new FormGroup({
      instituteName: this.instituteName,
      logo: this.logo,
      address: this.address,
      code: this.code,
      registeredDate: this.registeredDate,
      state: this.state,
      city: this.city,
      district: this.district,
      country: this.country,
      name: this.name,
      userName: this.userName,
      email: this.email,
      mobile: this.mobile
    });
  }

  public openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { ignoreBackdropClick: true });
  }
  // public uploadImage(selectedLogo: Ng4FilesSelected): void {
  //   console.log(selectedLogo);
  //   if (selectedLogo.status !== Ng4FilesStatus.STATUS_SUCCESS) {
  //     this.selectedLogo = selectedLogo.status;
  //     this.imageError = true;
  //     return;
  //   }
  //   this.selectedLogo = Array.from(selectedLogo.files).map(file => file.name);
  // }
  public onSubmit(instituteform) {
    console.log(instituteform.value);
    if (this.instituteform.valid) {

      this.error = '';
      this.auth.addInstitute(this.instituteform.value)
          .then((resp)=>{
            if (resp.json().success) {
              console.log('Inst Added Successfully');
              this.instituteform.reset();
              let closeBtn = document.getElementById('closeInstForm');
              closeBtn.click();
            } else {
              console.log('Inst Add Failed')
              this.error = resp.json().message;
            }
          })
          .catch((err) => {
          console.log('Add Inst Err', err);
          this.error = err.json().message;
        });

    }

    
  }
}
