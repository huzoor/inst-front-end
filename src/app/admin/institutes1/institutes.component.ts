import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
//import { Ng4FilesService, Ng4FilesConfig, Ng4FilesStatus, Ng4FilesSelected } from 'angular4-files-upload';
declare var AdminLTE: any;
@Component({
  selector: 'app-institutes',
  templateUrl: './institutes.component.html',
  styleUrls: ['./institutes.component.css']
})
export class InstitutesComponent implements OnInit {
  public modalRef: BsModalRef;
  public instituteform: FormGroup;
  public instituteName: FormControl;
  public selectedLogo: any;
  public imageError: boolean;
  public logo: FormControl;
  public address: FormControl;
  public code: FormControl;
  public pincode: FormControl;
  public state: FormControl;
  public city: FormControl;
  public district: FormControl;
  public country: FormControl;
  // private configImage: Ng4FilesConfig = {
  //   acceptExtensions: ['jpg', 'jpeg', 'png'],
  //   maxFilesCount: 1
  // };
  constructor(private modalService: BsModalService
  ) { }

  ngOnInit() {
    AdminLTE.init();
    this.instituteName = new FormControl('', []);
    this.logo = new FormControl('', []);
    this.address = new FormControl('', []);
    this.code = new FormControl('', []);
    this.pincode = new FormControl('', []);
    this.state = new FormControl('', []);
    this.city = new FormControl('', []);
    this.district = new FormControl('', []);
    this.country = new FormControl('', []);
   // this.ng4FilesService.addConfig(this.configImage, 'institute-logo');
    this.formFileds();
  }
  formFileds() {
    this.instituteform = new FormGroup({
      instituteName: this.instituteName,
      logo: this.logo,
      address: this.address,
      code: this.code,
      pincode: this.pincode,
      state: this.state,
      city: this.city,
      district: this.district,
      country: this.country
    });
  }

  public openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
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
    console.log(instituteform);
  }
}
