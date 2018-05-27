import { Component, OnInit, TemplateRef, ElementRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { DataService } from '../../shared/data.service';
import {FileUploader} from '../../../../node_modules/ng2-file-upload';
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
  constructor(private modalService: BsModalService) { }

  ngOnInit() {
    AdminLTE.init();
    this.galleryList = [{
      title: 'Topper of the student',
      image: 'assets/img/user2-160x160.jpg',
      description: 'He got 100% marks in 2018 10th result and he is the topper of the school'
    },
    {
      title: 'Topper of the student',
      image: 'assets/img/user2-160x160.jpg',
      description: 'He got 100% marks in 2018 10th result and he is the topper of the school'
    },
    {
      title: 'Topper of the student',
      image: 'assets/img/user2-160x160.jpg',
      description: 'He got 100% marks in 2018 10th result and he is the topper of the school'
    },
    {
      title: 'Topper of the student',
      image: 'assets/img/user2-160x160.jpg',
      description: 'He got 100% marks in 2018 10th result and he is the topper of the school'
    }]
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
    console.log(file);
  }
  public addGalleryData(formData: any): void {
    console.log(formData.value);
  }

  
}
