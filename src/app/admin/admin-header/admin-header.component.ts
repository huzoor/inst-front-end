import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../../shared/data.service';

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.css']
})
export class AdminHeaderComponent implements OnInit {
  public modalRef: BsModalRef;
  public userRole: number ;
  public roleType: String ;
  public userName: String ;
  public name: String ;
  public resetUrl: String ;

  constructor(private auth: DataService,
    private modalService: BsModalService, 
    private toastr: ToastrService) { }

  public imageChangedEvent: any = '';
  public croppedImage: any = 'assets/img/user2-160x160.jpg';
  public error: any;

  ngOnInit() {
    this.userRole = parseInt(localStorage.getItem('role'), 10);
    this.userName = localStorage.getItem('userName');
    this.name = localStorage.getItem('name');
    this.roleType = localStorage.getItem('roleType');
    this.resetUrl = `change-password?userName=${this.userName}&type=${this.roleType}`;

    this.getImageDetails();
  }
  onLogout() {
    this.auth.logout();
  }

  public getImageDetails(){
    const inputDtls = {
      role : parseInt(localStorage.getItem('role'), 10),
      userName : localStorage.getItem('userName'),
    };

    this.auth.getImageDetails(inputDtls).then((resp) => {
      if(resp.json().success) {
        this.croppedImage = resp.json().logo
        localStorage.setItem('logo',resp.json().logo);
      }
      else this.error = resp.json().message;
    }).catch((err) => {
      console.log('err',err)
      this.error = err.json().message;
    });
  }

  fileChangeEvent(event: any, template: TemplateRef<any>): void {
    if (event.target.files.length !== 0) {
      this.imageChangedEvent = event;
      this.modalRef = this.modalService.show(template, { ignoreBackdropClick: true });
    }
  }
  imageCropped(image: string) {
    this.croppedImage = image;
  }
  imageLoaded() {
   // console.log("success");
  }
  loadImageFailed() {
    //console.log("error");
  }

  public uloadImage() {
    console.log(this.croppedImage);
    const imageDetails = {
      userName: localStorage.getItem('userName'),
      role: parseInt(localStorage.getItem('role'), 10),
      logo : this.croppedImage,
    } 
    this.auth.addImageDetails(imageDetails).then((resp) => {
      if(resp.json().success){ 
        this.getImageDetails();
        this.toastr.success(`${localStorage.getItem('userName')} Image uploaded successfully`);
        location.reload();
      } else {
        this.error = resp.json().message;
        this.toastr.error(`${localStorage.getItem('userName')} Image upload failed... Please try again`);
      }
    }).catch((err) => {
      // console.log('err',err)
      // this.error = err.json().message;
      this.toastr.error(`${err.json().message}`);
    });
    this.modalRef.hide();
  };


  changePassword(template: TemplateRef<any>): void {
      this.modalRef = this.modalService.show(template, { ignoreBackdropClick: true });
  }

}
