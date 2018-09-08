import { Component, OnInit, TemplateRef, ElementRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MyDatePickerModule, IMyDpOptions } from 'mydatepicker';
import { examTypes } from '../../shared/AppConstants';
import { DataService } from '../../shared/data.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
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
  public fetchedMarksList: any = [];
  public studentList: any = [];
  public error: any = '';
  public userRoleType: any;
  
  constructor(private modalService: BsModalService,
    private eleRef: ElementRef,
    private dataService: DataService,
    private toastr: ToastrService,
    private loadingIndicator: NgxSpinnerService) { }

  ngOnInit() {
    AdminLTE.init();
    this.loadingIndicator.show();
    this.testName = new FormControl('', []);
    this.classCode = new FormControl('', []);
    this.subjectCode = new FormControl('', []);
    this.examType = new FormControl('', []);
    this.userRoleType = parseInt(localStorage.getItem('role'), 10);

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
    let instituteUserName = localStorage.getItem('instituteUserName');
    let entityType = `classes`;
    this.dataService.getEntitiesList({ instituteUserName, entityType })
      .then((resp) => {
        this.loadingIndicator.hide();
        let res = resp.json()
        if (res.success) {
          if(this.userRoleType == 104){
            let studentClsId = localStorage.getItem('classID');
            this.classList = res.Classes.filter(item => item._id == studentClsId )
          } else this.classList = res.Classes;
        } else this.toastr.error(`${resp.json().message}`); 
        // this.error = resp.json().message;

      }).catch((err) => {
        this.loadingIndicator.hide();
        // this.error = err.json().message;
        this.toastr.error(`${err.json().message}`);
      });
  }

  public onClassChange(classId) {
    this.error = '';
    this.subjectCode.setValue('');
    this.getSubjectsList(classId);
    this.studentList = [];
  }
  public makeStudentsEmpty(classId) {
    this.studentList = [];
  }

  public getSubjectsList(classId): void {
    // Get instituteUserName from localStorage
    this.loadingIndicator.show();
    let instituteUserName = localStorage.getItem('instituteUserName');
    let schoolUserName = localStorage.getItem('schoolUserName');

    this.dataService.getEntitiesList({ instituteUserName, schoolUserName, classId })
      .then((resp) => {
        this.loadingIndicator.hide();
        let res = resp.json()
        if (res.success) {
          this.subjectsList = res.Subjects;
        } else this.toastr.error(`${resp.json().message}`); 
        //this.error = resp.json().message;

      }).catch((err) => {
        this.loadingIndicator.hide();
        // this.error = err.json().message;
        this.toastr.error(`${err.json().message}`);
      });
  }

  getClassName(code) {
    return this.classList.filter(i => i._id == code)[0].className;
  }

  getSubjectName(code) {
    return this.subjectsList.filter(i => i._id == code)[0].subjectName
  }
 
  getExamName(code) {
    return this.examsList.filter(i => i._id == code)[0].testName
  }

  public createNewExam(examForm): void {
    this.loadingIndicator.show();
    this.error = '';
    let instituteUserName = localStorage.getItem('instituteUserName');
    let schoolUserName = localStorage.getItem('schoolUserName');
    if (examForm.valid) {
      examForm.value.instituteUserName = instituteUserName;
      examForm.value.schoolUserName = schoolUserName;
      this.dataService.addExam(examForm.value)
        .then((resp) => {
          this.loadingIndicator.hide();
          if (resp.json().success) {
            this.modalRef.hide();
            this.getExamsList();
          } else this.toastr.error(`${resp.json().message}`);
          // this.error = resp.json().message;
        }).catch((err) => {
          this.loadingIndicator.hide();
          // this.error = 'Error in adding Exam';
          this.toastr.error(`Error in adding Exam`);
        });
    }
  }

  public getExamsList(): void {

    let instituteUserName = localStorage.getItem('instituteUserName');
    let schoolUserName = localStorage.getItem('schoolUserName');

    this.dataService.getExamsList({ instituteUserName, schoolUserName })
      .then((resp) => {
        this.loadingIndicator.hide();
        if (resp.json().success) {
          this.examsList = resp.json().examsList
        } else this.toastr.error(`${resp.json().message}`);
        // this.error = resp.json().message;
      }).catch((err) => {
        console.log('err', err)
        // this.error = 'Error in adding Exam';
        this.toastr.error(`Error in adding Exam`);
      });
  }

  public getStudentList(marksForm) {
    // get this info from LocalStorage
    this.loadingIndicator.show();
    let schoolUserName = localStorage.getItem('schoolUserName');
    let instituteUserName = localStorage.getItem('instituteUserName');
    let classEnrolled = marksForm.value.classCode;
    let subjectId = marksForm.value.subjectCode;

    this.dataService.getStudentsList({ schoolUserName, instituteUserName, classEnrolled })
      .then((resp) => {
        this.loadingIndicator.hide();
        if (resp.json().success) {
          let stuList = resp.json().studentsList;
          if(this.userRoleType == 104){
            let studentId = localStorage.getItem('studentId');
            stuList = resp.json().studentsList.filter(item => item._id == studentId )
          } 

          this.studentList = stuList.map(stu => {
            return {
              name: stu.name,
              rollNumber: stu.rollNumber,
              classEnrolled,
              studentId: stu._id,
              subjectId,
              marks: this.getMarks(stu._id)
            }
          });
          
        } else this.toastr.error(`students list loading failed..!`); 
        // this.error = 'students list loading failed..!';
      });
  }
  getMarks(stuId) {
    if (this.fetchedMarksList.length === 0) return 0;

    let studentInfo = this.fetchedMarksList[0].marksObtained.filter(stu => stu.studentId === stuId)
    if (studentInfo.length > 0) return studentInfo[0].marks;
    else return 0;
  }

  getMarksList(marksForm): Promise<any> {
    this.loadingIndicator.show();
    let schoolUserName = localStorage.getItem('schoolUserName');
    let instituteUserName = localStorage.getItem('instituteUserName');
    let classId = marksForm.value.classCode;
    let subjectId = marksForm.value.subjectCode;
    let examType = marksForm.value.examType;

    return this.dataService.getMarksList({ instituteUserName, schoolUserName, classId, subjectId, examType })
      .then((resp) => {
        this.loadingIndicator.hide();
        if (resp.json().success) {
          this.fetchedMarksList = resp.json().MarksList;
          return true;
        } else {
          this.toastr.error(`students list loading failed..!`); 
          // this.error = 'students list loading failed..!';
          return false;
        }
      });
  }

  public enterStudentMarks(marksForm): void {
    // console.log(marksForm.value);
    this.examType = marksForm.value.examType;
    this.getMarksList(marksForm).then(canLoadStudents => {
      if (canLoadStudents) {
        this.getStudentList(marksForm);
        this.showStudentsList = true;
      } else  this.toastr.error(`students list loading failed..!`); 
    })

  }

  public addStudentMarks(studentMarks, selectedExamData): void {
    // console.log(studentMarks);
    this.loadingIndicator.show();
    let schoolUserName = localStorage.getItem('schoolUserName');
    let instituteUserName = localStorage.getItem('instituteUserName');
    let classId = this.classCode.value;
    let subjectId = this.subjectCode.value;
    let examType = this.examType;

    this.dataService.addStudentMarks({ instituteUserName, schoolUserName, classId, subjectId, examType, marksObtained: studentMarks })
      .then((resp) => {
        this.loadingIndicator.hide();
        if (resp.json().success) {
          this.showStudentsList = false;
          this.toastr.success(`${resp.json().message}`);
          this.enterStudentMarks(selectedExamData);
        }
      }).catch((err) => {
        this.loadingIndicator.hide();
        this.toastr.error(`${err.json().message}`);
      });
  }
}
