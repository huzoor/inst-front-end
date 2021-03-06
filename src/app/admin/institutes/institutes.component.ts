import { Component, OnInit, TemplateRef, ElementRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MyDatePickerModule, IMyDpOptions } from 'mydatepicker';
import { countriesList, statesList, districtsList, validation }  from '../../shared/AppConstants';
import { NgxSpinnerService } from 'ngx-spinner';
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
  public imageError: boolean;
  public address: FormControl;
  public code: FormControl;
  public registeredDate: FormControl;
  public state: FormControl;
  public city: FormControl;
  public district: FormControl;
  public country: FormControl;
  public userName: FormControl;
  public email: FormControl;
  public mobile: FormControl;
  public _id: FormControl;
  public error: any;
  public instAvailStaus: String = '';
  public deleteRecord: any;

  public countriesList: any = countriesList;
  public statesList: any = statesList;
  public districtsList: any = districtsList;

  constructor(private modalService: BsModalService, 
    private eleRef: ElementRef, 
    private dataService: DataService,
    private loadingIndicator: NgxSpinnerService) { }

  ngOnInit() {
    AdminLTE.init();
    this.loadingIndicator.show();
    this.instituteName = new FormControl('', []);
    this.address = new FormControl('', []);
    this.code = new FormControl('', []);
    this.registeredDate = new FormControl('', []);
    this.state = new FormControl('', []);
    this.city = new FormControl('', []);
    this.district = new FormControl('', []);
    this.country = new FormControl('', []);
    this.userName = new FormControl('', []);
    this.email = new FormControl('', Validators.pattern(validation.email));
    this.mobile = new FormControl('', [Validators.minLength(10), Validators.maxLength(10)]);
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
  
  public getRegSchoolsCount(instituteUserName): any {

    this.dataService.getRegSchoolsCount({instituteUserName})
      .then((resp) => {

        if (resp.json().success) {
          this.loadingIndicator.hide();
          console.log('Inst Loaded ', resp.json().count);
          return 1;
        } else {
          return 0;
        }
      });
  }

  getInstitutesList() {
    this.dataService.getInstitutes()
      .then((resp) => {
        if (resp.json().success) {
          this.loadingIndicator.hide();
          console.log('Inst Loaded ', resp.json().institutes);
          this.instituteList = resp.json().institutes;
        } else {
          this.loadingIndicator.hide();
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
      address: this.address,
      code: this.code,
      registeredDate: this.registeredDate,
      state: this.state,
      city: this.city,
      district: this.district,
      country: this.country,
      userName: this.userName,
      email: this.email,
      mobile: this.mobile,
      _id: this._id
    });
  }

  public createEditForm(template: TemplateRef<any>, editData) {
    this.modalRef = this.modalService.show(template, { ignoreBackdropClick: true });
    if (editData !== '' ) {
      this.showEditForm = true;
      const registeredDt = new Date(editData.registeredDate);
      const splitDate = editData.registeredDate.split('/');
      const date = { "date": { "year": registeredDt.getFullYear(), "month": (registeredDt.getMonth()+1), "day": registeredDt.getDate() }, "jsdate": "", "formatted": editData.registeredDate, "epoc": "" }
      this.instituteform.setValue({
        instituteName: editData.instituteName,
        address: editData.address,
        code: editData.code,
        registeredDate: date,
        state: editData.state,
        city: editData.city,
        district: editData.district,
        country: editData.country,
        userName: editData.userName,
        email: editData.email,
        mobile: editData.mobile,
        _id: editData._id
      });

      // const date = {"date":{"year":splitDate[2],"month":splitDate[0],"day":splitDate[1]},"jsdate":"","formatted":editData.registeredDate,"epoc":""}
  //    this.instituteform.get('registeredDate').setValue(date);
    } else {
      console.log("create");
      this.instituteform.reset();
      this.showEditForm = false;
    }
  }

  public saveInstituteForm(instituteform) {
    this.loadingIndicator.show();
    console.log(instituteform.value.registeredDate);
    if (this.instituteform.valid) {
      this.error = '';
      this.instituteform.value.formMode = `create`;
      this.dataService.addInstitute(this.instituteform.value)
        .then((resp) => {
          this.loadingIndicator.hide();
          if (resp.json().success) {
            this.instituteform.reset();
            this.modalRef.hide();
            this.getInstitutesList();
          } else {
            this.error = resp.json().message;
          }
        })
        .catch((err) => {
          this.loadingIndicator.hide();
          console.log('Add Inst Err', err);
          this.error = err.json().message;
        });
    }

  }
  
  public updateInstituteForm(instituteform) {
    this.loadingIndicator.show();
    this.instituteform.get('registeredDate').setValue(instituteform.value.registeredDate.formatted);
    console.log(instituteform.value);
    if (this.instituteform.valid) {
      this.error = '';
      this.instituteform.value.formMode = `update`;
      this.dataService.addInstitute(this.instituteform.value)
        .then((resp) => {
          this.loadingIndicator.hide();
          if (resp.json().success) {
            this.instituteform.reset();
            this.modalRef.hide();
            this.getInstitutesList();
          } else {
            this.error = resp.json().message;
          }
        })
        .catch((err) => {
          this.loadingIndicator.hide();
          console.log('Add Inst Err', err);
          this.error = err.json().message;
        });
    }
  }
  public deleteInstitute(template: TemplateRef<any>, deleteData) {
    this.modalRef = this.modalService.show(template, { ignoreBackdropClick: true, class: 'custom-modal' });
    this.deleteRecord = deleteData;
  };
  
  removeInstitute(institute){
    const endPoint = `removeInstitute`;
    this.modalRef.hide();
    this.loadingIndicator.show();
    this.dataService.removeInstance({_id: institute._id}, endPoint)
    .then((resp) => {
      this.loadingIndicator.hide();
      if (resp.json().success) {
        this.getInstitutesList();
      } else {
        this.error = resp.json().message;
      }
    })
    .catch((err) => {
      this.loadingIndicator.hide();
      console.log('Remove Inst Err', err);
      this.error = err.json().message;
    });
  }

  instititeAvailStaus(event){
   const instituteName = event.target.value;
   if( instituteName !=='undefined'  && instituteName.length > 3)
    this.dataService.instnceAvailStaus(instituteName, 'instAvailStaus')
    .then((resp) => {
      if (resp.json().success) {
        this.instAvailStaus = '';
      } else {
        this.instAvailStaus = resp.json().message;
      }
    })
    .catch((err) => {
      console.log('Avail Inst Err', err);
      this.error = err.json().message;
    });
  }

}
