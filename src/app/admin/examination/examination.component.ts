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
  public testName: FormControl;
  public placeholder = 'mm/dd/yyyy';
  public modalRef: BsModalRef;
  public examinationForm: FormGroup;
  public testForm: FormGroup;
  public subjectCode: FormControl;
  public classCode: FormControl;
  public examType: FormControl;

  
  public externalExamTypes: any[];
  public examsList: any[];
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
    this.testName = new FormControl('', []);
    this.classCode = new FormControl('', []);
    this.subjectCode = new FormControl('', []);
    this.examType = new FormControl('', []);

    this.formFileds();
    this.getClassesList();
    this.getExamsList();
  }

  public openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { ignoreBackdropClick: true });
  }

  formFileds() {
    this.testForm = new FormGroup({
      testName: this.testName,
    });

    this.examinationForm = new FormGroup({
          examType: this.examType,
          classCode: this.classCode,
          subjectCode: this.subjectCode,
    });
  }


  public getClassesList(): void {
    // Get instituteUserName from localStorage
    let instituteUserName = `inst1-INST`;
    let entityType = `classes`;

    this.dataService.getEntitiesList({ instituteUserName, entityType })
      .then((resp) => {
        let res = resp.json()
        if (res.success) {
          this.classList = res.Classes;
        } else this.error = resp.json().message;

      }).catch((err) => {
        console.log('err', err)
        this.error = err.json().message;
      });
  }
  public onClassChange(classId){
    this.getSubjectsList(classId);
  }

  public getSubjectsList(classId): void {
    // Get instituteUserName from localStorage
    let instituteUserName = `inst1-INST`;
    let schoolUserName = `sch1-SCH`;

    this.dataService.getEntitiesList({ instituteUserName, schoolUserName, classId })
      .then((resp) => {
        let res = resp.json()
        if (res.success) {
          this.subjectsList = res.Subjects;
        } else this.error = resp.json().message;

      }).catch((err) => {
        console.log('err', err)
        this.error = err.json().message;
      });
  }

  getClassName(code) {
    return this.classList.filter(i => i._id == code)[0].className;
  }

  getSubjectName(code) {
    return this.subjectsList.filter(i => i._id == code)[0].subjectName
  }

  public createExam(examForm): void {
    let instituteUserName = `inst1-INST`;
    let schoolUserName = `sch1-SCH`;
    if (examForm.valid) {
      examForm.value.instituteUserName = instituteUserName;
      examForm.value.schoolUserName = schoolUserName;
      this.dataService.addExam(examForm.value)
        .then((resp) => {
          if (resp.json().success) {
            this.modalRef.hide();
            this.getExamsList();
          } else this.error = resp.json().message;
        }).catch((err) => {
          console.log('err', err)
          this.error = 'Error in adding Exam';
        });
    }
  }

  public getExamsList(): void {

    let instituteUserName = 'inst1-INST';
    let schoolUserName = 'sch1-SCH';

    this.dataService.getExamsList({ instituteUserName, schoolUserName })
      .then((resp) => {
        if (resp.json().success) {
          this.examsList = resp.json().examsList
        } else this.error = resp.json().message;
      }).catch((err) => {
        console.log('err', err)
        this.error = 'Error in adding Exam';
      });
  }

  public getStudentList(marksForm) {
    // get this info from LocalStorage
    let schoolUserName = 'sch1-SCH';
    let instituteUserName = 'inst1-INST';
    let classEnrolled = marksForm.value.classCode;

    this.dataService.getStudentsList({ schoolUserName, instituteUserName, classEnrolled })
      .then((resp) => {
        if (resp.json().success) this.studentList = resp.json().studentsList;
        else this.error = 'students list loading failed..!';
      });
  }

  public enterStudentMarks(marksForm): void {
    // console.log(marksForm.value);
    this.examType = marksForm.value.examType;
    this.getStudentList(marksForm);
    this.showStudentsList = true;
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
