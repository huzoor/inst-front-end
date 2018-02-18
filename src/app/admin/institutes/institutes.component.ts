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
  // public instituteList: any = require('./institute.json');
  public instituteList: any ;
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
  public instituteAdminName: FormControl;
  public userName: FormControl;
  public password: FormControl;
  public email: FormControl;
  public mobile: FormControl;
  public error: any;
  // private configImage: Ng4FilesConfig = {
  //   acceptExtensions: ['jpg', 'jpeg', 'png'],
  //   maxFilesCount: 1
  // };
  constructor(private modalService: BsModalService,private eleRef: ElementRef, private dataService: DataService ) { }

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
    this.instituteAdminName = new FormControl('', []);
    this.userName = new FormControl('', []);
    this.password = new FormControl('', []);
    this.email = new FormControl('', []);
    this.mobile = new FormControl('', []);
   // this.ng4FilesService.addConfig(this.configImage, 'institute-logo');
    this.formFileds();

    this.getInstitutesList();
  }
  getInstitutesList(){
    this.dataService.getInstitutes(this.instituteform.value)
        .then((resp)=>{
          if (resp.json().success) {
            console.log('Inst Loaded ', resp.json().institutes);
            this.instituteList = resp.json().institutes
          } else {
            console.log('Inst Load Failed')
            this.error = 'Institutes loading failed..!';
          }
        })
  }
  formatDate(dt){
    return (new Date(dt).toISOString().slice(0,10));
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
      instituteAdminName: this.instituteAdminName,
      userName: this.userName,
      password: this.password,
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
    if (this.instituteform.valid) {
      this.error = '';
      this.dataService.addInstitute(this.instituteform.value)
          .then((resp)=>{
            if (resp.json().success) {
              this.instituteform.reset();
              document.getElementById('closeInstForm').click();
              this.getInstitutesList();
            } else {
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
