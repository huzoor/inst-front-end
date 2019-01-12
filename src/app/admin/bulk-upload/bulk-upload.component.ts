import { Component, OnInit, ViewChild} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../shared/data.service';
import { FileUtil } from '../../shared/file.util';
declare var AdminLTE: any;

@Component({
  selector: 'app-bulk-upload',
  templateUrl: './bulk-upload.component.html',
  styleUrls: ['./bulk-upload.component.css']
})
export class BulkUploadComponent implements OnInit {
  @ViewChild('csvImportInput')
  csvImportInput: any;

  public bulkUploadForm: FormGroup;
  public uploadType: FormControl;
  public filesToUpload: Array<File>;
  public csvRecords: any;
  public CSVConstants : any = {
    tokenDelimeter: ",",
    isHeaderPresentFlag: true,
    validateHeaderAndRecordLengthFlag: true,
    valildateFileExtenstionFlag: true,
 }
  
  constructor(private dataService: DataService, 
    private toastr: ToastrService,
    private loadingIndicator: NgxSpinnerService,
    private _fileUtil: FileUtil) { }

  ngOnInit() {
    AdminLTE.init();
    this.uploadType = new FormControl('', []);
    this.bulkUploadForm = new FormGroup({
      uploadType: this.uploadType,
    });
  }

  uploadXls($event: any): void {
    // console.log(file);
    let text = [];
    let target = $event.target || $event.srcElement;
    let files = target.files; 
    if(this.CSVConstants.validateHeaderAndRecordLengthFlag){
      if(!this._fileUtil.isCSVFile(files[0])){
        alert("Please import valid .csv file.");
        this.fileReset();
      }
    }
    let input = $event.target;
    let reader = new FileReader();
    reader.readAsText(input.files[0]);
    reader.onload = (data) => {
      let csvData = reader.result;
      let csvRecordsArray = csvData.split(/\r\n|\n/);
      csvRecordsArray.map((item,index) => {
        if(item == "") csvRecordsArray.pop(index)
      })

      let headerLength = -1;
      if(this.CSVConstants.isHeaderPresentFlag){
        let headersRow = this._fileUtil.getHeaderArray(csvRecordsArray, this.CSVConstants.tokenDelimeter);
        headerLength = headersRow.length; 
      }
      
      this.csvRecords = this._fileUtil.getDataRecordsArrayFromCSVFile(csvRecordsArray, 
          headerLength, this.CSVConstants.validateHeaderAndRecordLengthFlag, this.CSVConstants.tokenDelimeter);
      
      if(this.csvRecords == null){
        //If control reached here it means csv file contains error, reset file.
        this.fileReset();
      }    
    }
    reader.onerror =  () => {
      this.fileReset();
      this.toastr.success('Unable to read ' + input.files[0]);
    };
  }

  public proceedToUpload(formData:any): void {
    if(!formData.valid){
      this.toastr.error(`Please fill the form !!`);
    } else {
      this.loadingIndicator.show();
      let schoolUserName = localStorage.getItem('schoolUserName'),
      instituteUserName = localStorage.getItem('instituteUserName'),
      inputInfo = {
        uploadType: this.bulkUploadForm.value.uploadType,
        headers:this.csvRecords.shift(),//Sending Table Headers
        records: this.csvRecords, //Sending recors, since we had used shift() -> headers will bw removed and plain records are gonna sent over post
        schoolUserName,
        instituteUserName,
        uri: `bulkUpload`
      }
      this.dataService.bulkUpload(inputInfo)
        .then((resp) => {
          this.loadingIndicator.hide();
          this.fileReset();
          if (resp.json().success) {
           this.toastr.success(resp.json().message);
          } else {
            this.toastr.error(`Please try again..!`)
          }
        })
        .catch((err) => {
          console.log('password change Err', err);
          this.toastr.error(`Please try again..!`);
        });
    }
    console.log('this.filesToUpload',this.bulkUploadForm.value.uploadType);
  }

  fileReset(){
    this.csvImportInput.nativeElement.value = "";
    this.csvRecords = [];
  }

}
