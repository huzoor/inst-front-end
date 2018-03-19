import { Component, OnInit, TemplateRef, ElementRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MyDatePickerModule, IMyDpOptions } from 'mydatepicker';
import { DataService } from '../../shared/data.service';

declare var AdminLTE: any;

@Component({
  selector: 'app-examination',
  templateUrl: './examination.component.html',
  styleUrls: ['./examination.component.css']
})
export class ExaminationComponent implements OnInit {
  public placeholder = 'mm/dd/yyyy';
  public modalRef: BsModalRef;
  public examinationForm: FormGroup;
  public examDate: FormControl;
  public className: FormControl;
  public subject: FormControl;
  public examType: FormControl
  public marks: FormControl;
  public examList: any = [];
  public classList: any = [];
  public subjectsList: any = [];
  public showStudentsList: boolean = false;
  public studentList: any = [];
  public error: any;
  constructor(private modalService: BsModalService,
    private eleRef: ElementRef,
    private dataService: DataService) { }

  ngOnInit() {
    AdminLTE.init();
    this.examDate = new FormControl('', []);
    this.subject = new FormControl('', []);
    this.className = new FormControl('', []);
    this.examType = new FormControl('', []);
    this.marks = new FormControl('', []);
    this.formFileds();
    this.examList = [{
      class: "first class",
      subject: "Telugu",
      examType: "UNIT-TEST I",
      examDate: "12/06/2018",
      totalMarks: 50
    }];
    this.getEntitiesList();
  }

  public openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { ignoreBackdropClick: true });
  }

  formFileds() {
    this.examinationForm = new FormGroup({
      className: this.className,
      subject: this.subject,
      examType: this.examType,
      marks: this.marks,
      examDate: this.examDate
    });
  }


  public getEntitiesList() {
    // Get instituteUserName from localStorage
    let instituteUserName = 'inst1-INST';
   this.dataService.getEntitiesList(instituteUserName)
    .then((resp) => {
      if (resp.json().success) {
        this.classList = resp.json().Classes;
        this.subjectsList = resp.json().Subjects;
      }
        else this.error = resp.json().message;
    }).catch((err) => {
      console.log('err',err)
      this.error = err.json().message;
    })
  }


  public createExams(examForm): void {
    console.log(examForm);
    // this.dataService.saveExamType(examForm)
    // .then((resp) => {
    //   if (resp.json().success) {
    //     this.classList = resp.json().Classes;
    //     this.subjectsList = resp.json().Subjects;
    //   }
    //     else this.error = resp.json().message;
    // }).catch((err) => {
    //   console.log('err',err)
    //   this.error = err.json().message;
    // });
  }

  public enterStudentMarks(marksForm): void {
    console.log(marksForm.value);
    this.examType = marksForm.value.examType;
    this.showStudentsList= true;
    this.studentList = [{
      rollNumber: 2000,
      name: 'koppala',
      marks: ''
    },
    {
      rollNumber: 2001,
      name: 'koppala1',
      marks: ''
    },
    {
      rollNumber: 2002,
      name: 'koppala2',
      marks: ''
    },
    {
      rollNumber: 2002,
      name: 'koppala1',
      marks: ''
    },
    {
      rollNumber: 2004,
      name: 'koppala1',
      marks: ''
    }];
  }

  public saveStudentMarks(studentMarks): void {
    console.log(studentMarks);
    // this.dataService.savStudentMarks(examForm)
    // .then((resp) => {
    // }).catch((err) => {
    //   console.log('err',err)
    //   this.error = err.json().message;
    // });
  }
}
