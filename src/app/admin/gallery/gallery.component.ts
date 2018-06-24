import { Component, OnInit, TemplateRef, ElementRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { DataService } from '../../shared/data.service';
import {FileUploader} from '../../../../node_modules/ng2-file-upload';
import { serviceUrl, imageBaseUri } from '../../shared/AppConstants';

declare var AdminLTE: any;
@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})

export class GalleryComponent implements OnInit {
  public galleryModal: BsModalRef;
  public galleryList: any;
  public galleryForm: FormGroup;
  public title: FormControl;
  public description: FormControl;
  public filesToUpload: Array<File>;
  public imageServerUri: String = imageBaseUri;
  public error: any;
  constructor(private modalService: BsModalService, private dataService: DataService) { }

  ngOnInit() {
    AdminLTE.init();
    this.getGalleryList();
    this.title = new FormControl('', []);
    this.description = new FormControl('', []);
    this.galleryForm = new FormGroup({
      title: this.title,
      description: this.description
    });
  }

  public addGallery(template: TemplateRef<any>) {
    this.galleryModal = this.modalService.show(template, { ignoreBackdropClick: true });
  }
  uploadImage(file: any): void {
    // console.log(file);
    this.filesToUpload = <Array<File>> file.target.files;
  }

  public addGalleryData(formData: any): void {
    // console.log(formData.value);
    this.makeFileRequest([], this.filesToUpload, formData.value).then((result) => {
        console.log(result);
        if(result){
          this.galleryForm.reset();
          this.getGalleryList();
          this.galleryModal.hide();
        }
    }, (error) => {
        console.error(error);
    });
  }

  public getGalleryList() {
    let role = parseInt(localStorage.getItem('role'),10);
    let entityType = ( (role === 101) ? localStorage.getItem('instituteUserName') : 
                       localStorage.getItem('schoolUserName'))
    this.dataService.getGalleryList({entityType})
      .then((resp) => {
        if (resp.json().success) {
          this.galleryList = resp.json().galleryList;
        } else {
          this.error = 'gallery list loading failed..!';
        }
      });
  }

  public makeFileRequest(params: Array<string>, files: Array<File>, formInfo: any) {
    let url = `${serviceUrl}/upload`;
    let role = parseInt(localStorage.getItem('role'),10);
    let entityType = ( (role === 101) ? localStorage.getItem('instituteUserName') : 
                       localStorage.getItem('schoolUserName'))
    return new Promise((resolve, reject) => {
        var formData: any = new FormData();
        var xhr = new XMLHttpRequest();
        if(formInfo){
          formData.append("title",formInfo.title)
          formData.append("description",formInfo.description)
          formData.append("entityType",entityType)
        }
        for(var i = 0; i < files.length; i++) {
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
