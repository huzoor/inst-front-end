import { Component, OnInit, TemplateRef, ElementRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { DataService } from '../../shared/data.service';
import { FileUploader } from '../../../../node_modules/ng2-file-upload';
import { serviceUrl, imageBaseUri } from '../../shared/AppConstants';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
declare var AdminLTE: any;
@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})

export class GalleryComponent implements OnInit {
  public modalRef: BsModalRef;
  public deleteGallery: any;
  public galleryModal: BsModalRef;
  public showEditForm: boolean = false;
  public galleryList: any;
  public galleryForm: FormGroup;
  public galleryId: String;
  public title: FormControl;
  public description: FormControl;
  public filesToUpload: Array<File>;
  public imageServerUri: String = imageBaseUri;
  public userRoleType: any;
  public currentUserName: any;
  public error: any;

  constructor(private modalService: BsModalService,
     private dataService: DataService,
     private toastr: ToastrService,
    private loadingIndicator: NgxSpinnerService) { }

  ngOnInit() {
    AdminLTE.init();
    this.loadingIndicator.show();
    this.getGalleryList();
    this.title = new FormControl('', []);
    this.description = new FormControl('', []);
    this.galleryForm = new FormGroup({
      title: this.title,
      description: this.description
    });
    this.userRoleType = parseInt(localStorage.getItem('role'), 10);
    this.currentUserName = localStorage.getItem('userName') ;
  }

  public createEditGallery(template: TemplateRef<any>, galleryInfo) {
    this.galleryModal = this.modalService.show(template, { ignoreBackdropClick: true });
    if (galleryInfo !== '') {
      this.showEditForm = true;
      this.galleryForm.setValue({
        title: galleryInfo.title,
        description: galleryInfo.description
      });
      this.galleryId = galleryInfo._id;
    } else {
      this.galleryForm.reset();
      this.showEditForm = false;
    }
  }
  uploadImage(file: any): void {
    // console.log(file);
    this.filesToUpload = <Array<File>>file.target.files;
  }

  public addGalleryData(formData: any): void {
    // console.log(formData.value);
    const url = `${serviceUrl}/addToGallery`;
    this.loadingIndicator.show();
    this.makeFileRequest([], this.filesToUpload, formData.value, url).then((result) => {
      // console.log(result);
      this.galleryId = '';
      if (result) {
        this.galleryModal.hide();
        this.loadingIndicator.hide();
        this.galleryForm.reset();
        this.getGalleryList();
        this.toastr.success(`Image Added Successfully`);
      }
    }, (error) => {
      console.error(error);
    });
  }

  public updateGallery(updateForm: any): void {
    // console.log(updateForm);
    this.loadingIndicator.show();
    const editUrl = `${serviceUrl}/editGallery`;
    let role = parseInt(localStorage.getItem('role'), 10), 
        entityType = ((role === 101) ? localStorage.getItem('instituteUserName') : localStorage.getItem('schoolUserName')),
        galFormInfo = {
        ...(updateForm.value),
        galId: this.galleryId,
        entityType
      }
      // console.log(galFormInfo)
       if(this.filesToUpload)
      this.makeFileRequest([], this.filesToUpload, {...galFormInfo}, editUrl).then((result) => {
        console.log(result);
        this.galleryId = '';
        if (result) {
          this.galleryModal.hide();
          this.loadingIndicator.hide();
          this.galleryForm.reset();
          this.getGalleryList();
          this.toastr.success(`Image updated Successfully`);
        }
      }, (error) => {
        console.error(error);
      });
    else this.dataService.setGalleryDesc(galFormInfo).then((result) => {
      // console.log(result);
      this.galleryId = '';
      if (result) {
        this.galleryModal.hide();
        this.loadingIndicator.hide();
        this.galleryForm.reset();
        this.getGalleryList();
        this.toastr.success(`Image updated Successfully`);
      }
    }, (error) => {
      console.error(error);
    });
  }

  public getGalleryList() {
    this.galleryList = [];
    // let role = parseInt(localStorage.getItem('role'), 10);
    // let entityType = ((role === 101) ? localStorage.getItem('instituteUserName') :
    //   localStorage.getItem('schoolUserName'))
    this.loadingIndicator.show();
    if(localStorage.getItem('instituteUserName'))
     this.dataService.getGalleryList({ entityType: localStorage.getItem('instituteUserName') })
      .then((resp) => {
        this.loadingIndicator.hide();
        if (resp.json().success) {
          this.galleryList = resp.json().galleryList.map(g=> g)
        } else {
          this.loadingIndicator.hide();
          this.error = 'gallery list loading failed..!';
          this.toastr.error(`gallery list loading failed...!`);
        }
      });
   
      if(localStorage.getItem('schoolUserName'))
     this.dataService.getGalleryList({ entityType: localStorage.getItem('schoolUserName') })
      .then((resp) => {
        this.loadingIndicator.hide();
        if (resp.json().success) {
          this.galleryList = [...this.galleryList, ...resp.json().galleryList.map(g=> g)]
        } else {
          this.loadingIndicator.hide();
          this.error = 'gallery list loading failed..!';
          this.toastr.error(`gallery list loading failed...!`);
        }
      });
  }

  public deleteGalleryIno(template: TemplateRef<any>, deleteData) {
    this.modalRef = this.modalService.show(template, { ignoreBackdropClick: true });
    this.deleteGallery = deleteData;
  };

  removeGallery(galleryData) {
    //Delete logic goes here
    
    console.log(galleryData);
    this.loadingIndicator.show();
    this.dataService.removeGalleryItem({galId: galleryData._id}).then((resp) => {
      if (resp.json().success) {
        this.modalRef.hide();
        this.toastr.success('Gallery deleted successfully');
        this.galleryList = this.galleryList.filter( gal=> gal._id != galleryData._id);
        this.loadingIndicator.hide();
      } else {
        this.loadingIndicator.hide();
        this.toastr.error(`gallery delete failed...!`);
      }
    });

  }

  public makeFileRequest(params: Array<string>, files: Array<File>, formInfo: any, editUrl:any = ``) {
    let url = editUrl.length > 0 ? editUrl : `${serviceUrl}/upload`;
    let role = parseInt(localStorage.getItem('role'), 10);
    let entityType = ((role === 101) ? localStorage.getItem('instituteUserName') :
      localStorage.getItem('schoolUserName'))
    return new Promise((resolve, reject) => {
      var formData: any = new FormData();
      var xhr = new XMLHttpRequest();
      if (formInfo) {
        formData.append("title", formInfo.title)
        formData.append("description", formInfo.description)
        formData.append("entityType", entityType)
        if(formInfo.galId)  formData.append("galId", formInfo.galId)
      }
      for (var i = 0; i < files.length; i++) {
        formData.append("imageName", files[i], files[i].name);
      }

      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
          if (xhr.status == 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(xhr.response);
          }
        }
      }
      xhr.open("POST", url, true);
      xhr.send(formData);
    });
  }


}
