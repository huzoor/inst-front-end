import { Component, OnInit, TemplateRef, ElementRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MyDatePickerModule, IMyDpOptions } from 'mydatepicker';
import { examTypes } from '../../shared/AppConstants';
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
  public classCode: FormControl;
  public subjectCode: FormControl;
  public examType: FormControl
  public totalMarks: FormControl;
  public examList: any = [];
  public examTypes: any[] = examTypes;
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
    this.examDate = new FormControl(new Date(), []);
    this.subjectCode = new FormControl('', []);
    this.classCode = new FormControl('', []);
    this.examType = new FormControl('', []);
    this.totalMarks = new FormControl(0, []);
    this.formFileds();
    this.getClassesList();
    this.getSubjectsList();
  
  }

  public openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { ignoreBackdropClick: true });
  }

  formFileds() {
    this.examinationForm = new FormGroup({
      classCode: this.classCode,
      subjectCode: this.subjectCode,
      examType: this.examType,
      totalMarks: this.totalMarks,
      examDate: this.examDate
    });
  }


  public getClassesList(): void {
    // Get instituteUserName from localStorage
    let instituteUserName = 'inst1-INST';
    let entityType ='classes';

    this.dataService.getEntitiesList({instituteUserName, entityType })
      .then((resp) => {
        let res = resp.json()
        if (res.success) {
          this.classList = res.Classes;
        } else this.error = resp.json().message;
        
      }).catch((err) => {
        console.log('err',err)
        this.error = err.json().message;
      });
  }
 
  public getSubjectsList(): void {
    // Get instituteUserName from localStorage
    let instituteUserName = 'inst1-INST';
    let schoolUserName = 'sch1-SCH';
    

    this.dataService.getEntitiesList({instituteUserName, schoolUserName })
      .then((resp) => {
        let res = resp.json()
        if (res.success) {
          this.subjectsList = res.Subjects;
          this.getExamsList();
        } else this.error = resp.json().message;
        
      }).catch((err) => {
        console.log('err',err)
        this.error = err.json().message;
      });
  }

  getClassName(code){
    return this.classList.filter(i=> i._id == code)[0].className;
  }
 
  getSubjectName(code){
    return this.subjectsList.filter(i=> i._id == code)[0].subjectName
  }
 
  getExamTypeDesc(type){
    return this.examTypes.filter(i=> i.type == type)[0].desc;
  }

  public createExams(examForm): void {
    let instituteUserName = 'inst1-INST';
    let schoolUserName = 'sch1-SCH';
    if(examForm.valid){
      examForm.value.instituteUserName = instituteUserName;
      examForm.value.schoolUserName = schoolUserName;
      this.dataService.addExam(examForm.value)
      .then((resp) => {
        if (resp.json().success) {
          this.modalRef.hide();
          this.getExamsList();
        } else this.error = resp.json().message;
      }).catch((err) => {
        console.log('err',err)
        this.error = 'Error in adding Exam';
      });
   }
  }

  public getExamsList(): void {
  
    let instituteUserName = 'inst1-INST';
    let schoolUserName = 'sch1-SCH';

    this.dataService.getExamsList({instituteUserName, schoolUserName})
    .then((resp) => {
      if (resp.json().success) {
        this.examList = resp.json().examsList
      } else this.error = resp.json().message;
    }).catch((err) => {
      console.log('err',err)
      this.error = 'Error in adding Exam';
    });
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
