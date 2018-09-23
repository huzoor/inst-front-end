import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../shared/data.service';
declare var AdminLTE: any;

@Component({
  selector: 'app-bulk-upload',
  templateUrl: './bulk-upload.component.html',
  styleUrls: ['./bulk-upload.component.css']
})
export class BulkUploadComponent implements OnInit {
  public bulkUploadForm: FormGroup;
  public uploadType: FormControl;
  public filesToUpload: Array<File>;
  
  constructor(private dataService: DataService, 
    private toastr: ToastrService,
    private loadingIndicator: NgxSpinnerService) { }

  ngOnInit() {
    AdminLTE.init();
    this.uploadType = new FormControl('', []);
    this.bulkUploadForm = new FormGroup({
      uploadType: this.uploadType,
    });
  }

  uploadXls(file: any): void {
    // console.log(file);
    this.filesToUpload = <Array<File>>file.target.files;
  }

}
