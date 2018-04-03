import { Component, OnInit, TemplateRef, ElementRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MyDatePickerModule, IMyDpOptions } from 'mydatepicker';
import { countriesList, statesList, districtsList }  from '../../shared/AppConstants';

import { DataService } from '../../shared/data.service';
declare var AdminLTE: any;
const date = new Date();
@Component({
  selector: 'app-institutes',
  templateUrl: './institutes.component.html',
  styleUrls: ['./institutes.component.css']
})
export class InstitutesComponent implements OnInit {
  public instituteList: any;
  public placeholder = 'mm/dd/yyyy';
  public showEditForm: boolean = false;
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
  public _id: FormControl;
  public error: any;

  public countriesList: any = countriesList;
  public statesList: any = statesList;
  public districtsList: any = districtsList;

  constructor(private modalService: BsModalService, private eleRef: ElementRef, private dataService: DataService) { }

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
    this._id = new FormControl('', []);
    this.formFileds();
    this.getInstitutesList();
  }

  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'm/d/yyyy',
  };

  public changeCountry(ctry) {
    this.statesList = statesList.filter((item) => item.countryCode === ctry);
  }

  public changeState(ste) {
    this.districtsList = districtsList.filter((item) => item.stateCode === ste);
  }

  getInstitutesList() {
    this.dataService.getInstitutes()
      .then((resp) => {
        if (resp.json().success) {
          console.log('Inst Loaded ', resp.json().institutes);
          this.instituteList = resp.json().institutes;
        } else {
          console.log('Inst Load Failed');
          this.error = 'Institutes loading failed..!';
        }
      });
  }
  formatDate(dt) {
    return (new Date(dt).toISOString().slice(0, 10));
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
      mobile: this.mobile,
      _id: this._id
    });
  }

  public createEditForm(template: TemplateRef<any>, editData) {
    this.modalRef = this.modalService.show(template, { ignoreBackdropClick: true });
    if (editData !== '' ) {
      console.log(editData);
      this.showEditForm = true;
      const splitDate = editData.registeredDate.split('/');
      this.instituteform.setValue(editData);
      const date = {"date":{"year":splitDate[2],"month":splitDate[0],"day":splitDate[1]},"jsdate":"","formatted":editData.registeredDate,"epoc":""}
      this.instituteform.get('registeredDate').setValue(date);
    } else {
      console.log("create");
      this.instituteform.reset();
      this.showEditForm = false;
    }
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
  public saveInstituteForm(instituteform) {
    console.log(instituteform.value.registeredDate);
    if (this.instituteform.valid) {
      this.error = '';
      this.instituteform.value.formMode = `cerate`;
      this.dataService.addInstitute(this.instituteform.value)
        .then((resp) => {
          if (resp.json().success) {
            this.instituteform.reset();
            this.modalRef.hide();
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
  
  public updateInstituteForm(instituteform) {
    this.instituteform.get('registeredDate').setValue(instituteform.value.registeredDate.formatted);
    console.log(instituteform.value);
    this.instituteform.value.formMode = 'update';
    // if (this.instituteform.valid) {
    //   this.error = '';
    //   this.dataService.addInstitute(this.instituteform.value)
    //     .then((resp) => {
    //       if (resp.json().success) {
    //         this.instituteform.reset();
    //         this.modalRef.hide();
    //         this.getInstitutesList();
    //       } else {
    //         this.error = resp.json().message;
    //       }
    //     })
    //     .catch((err) => {
    //       console.log('Add Inst Err', err);
    //       this.error = err.json().message;
    //     });
    // }

  }

}
