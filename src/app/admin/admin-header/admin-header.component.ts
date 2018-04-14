import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { DataService } from '../../shared/data.service';

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.css']
})
export class AdminHeaderComponent implements OnInit {
  public modalRef: BsModalRef;
  constructor(private auth: DataService,
    private modalService: BsModalService, ) { }

  public imageChangedEvent: any = '';
  public croppedImage: any = 'assets/img/user2-160x160.jpg';

  ngOnInit() {
  }
  onLogout() {
    this.auth.logout();
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
    this.modalRef.hide();
  };
}
