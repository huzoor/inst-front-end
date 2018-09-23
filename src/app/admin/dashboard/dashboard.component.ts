import { Component, OnInit } from '@angular/core';
// import {AccordionModule} from 'primeng/accordion';
import { DataService } from '../../shared/data.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

declare var AdminLTE: any;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public classChartOptions:any = {
    scaleShowVerticalLines: false,
    responsive: true,
    scales: {
      xAxes: [{
        stacked: true
      }],
      yAxes: [{
        stacked: true
      }]
    }
  };
  public classChartLabels:string[];
  public classChartType:string = 'bar';
  public classChartLegend:boolean = true;
  public graphColors: any[] = ['#00a65a', '#f39c12', '#002d76'];
  public classChartData:any[];

  public marksLabel:string[];
  public marksData:number[];
  public marksChartType:string = 'doughnut';
  public marksChartColor:any = [
    {
        backgroundColor: ['#00a65a','#f39c12', '#002d76']
    }
  ];
  public userRole: number;
  public multiStudentsLists: any[] = new Array();
  public classesList: any[] = new Array();
  public classNames: any[] = new Array();
  public attendanceInfo = new Array();

  constructor(private dataService: DataService, 
              private loadingIndicator: NgxSpinnerService,
              private toastr: ToastrService) { }

  ngOnInit() {
    AdminLTE.init();
    // this.classChartLabels = ['I Class', 'II Class', 'III Class', 'IV Class'];
    this.classChartData = [
      {data: [10, 11, 20, 25], label:'Present', backgroundColor: '#00a65a'},
      {data: [11, 11, 11, 40], label:'Absent', backgroundColor: '#3c8dbc'},
      {data: [11, 22, 22, 55], label:'Leave', backgroundColor: '#f39c12'}
    ];

    this.marksLabel = ['Pass', 'Failure', 'Absent'];
    this.marksData = [80, 15, 5];
    this.userRole = parseInt(localStorage.getItem('role'),10)
    if(this.userRole === 102){
      this.getClassesList();
    }

    if(this.userRole === 104){
      let studentsCount = parseInt(localStorage.getItem('studentsCount'),10);
      let userName = localStorage.getItem('studentUserName');
      if(studentsCount > 1){
        this.getSudentsListById(userName);
      }
    }
  }

  chartHovered($eve){}
  chartClicked($eve){}

  changeStudent(studentId){
    let currentStudent = this.multiStudentsLists.filter(item=> item._id == studentId);
    localStorage.setItem('instituteUserName',currentStudent[0].instituteUserName);
    localStorage.setItem('schoolUserName',currentStudent[0].schoolUserName);
    localStorage.setItem('studentId', currentStudent[0]._id);
    localStorage.setItem('name',currentStudent[0].name);
    localStorage.setItem('staffId','');
    document.getElementById('studentInfoName').innerText = currentStudent[0].name;
    document.getElementById('studentInfoTopRight').innerText = currentStudent[0].name;
    document.getElementById('studentInfoTopRightBox').innerText = currentStudent[0].name;
    this.getStaffByClassId(currentStudent[0].classEnrolled, 
                           currentStudent[0].instituteUserName, 
                           currentStudent[0].schoolUserName);
  }

  public getStaffByClassId(classId, instituteUserName, schoolUserName){
    this.dataService.getStaffByClassId({classId, instituteUserName, schoolUserName})
        .then((resp) => {
          if (resp.json().success) {
            this.loadingIndicator.hide();
            // console.log('Staff Loaded ', resp.json());
            localStorage.setItem('staffId',resp.json().staffId);
          } else {
            this.loadingIndicator.hide();
          }
        });
  }

  public getSudentsListById(studentUserName){
    this.dataService.getStudentsListById({ userName: studentUserName })
        .then((resp) => {
          if (resp.json().success) {
            this.loadingIndicator.hide();
            console.log('Students Loaded ', resp.json().studentsList);
            this.multiStudentsLists = resp.json().studentsList;
          } else {
            this.loadingIndicator.hide();
          
          }
        });
  }

  public getClassesList(): void {
    let instituteUserName = localStorage.getItem('instituteUserName');
    // let schoolUserName = localStorage.getItem('schoolUserName');
    let entityType = 'classes';
    this.dataService.getEntitiesList({ instituteUserName, entityType })
      .then((resp) => {
        this.loadingIndicator.hide();
        let res = resp.json()
        if (res.success) {
          this.classesList = res.Classes;
          console.log('this.classesList', this.classesList);
          this.getAttendance();
        }
        else this.toastr.error('No Classes Found');

      }).catch((err) => {
        console.log('err', err);
        this.toastr.error('Unable to get class list');
      });
  }

  public getAttendance(): void {
    let schoolUserName = localStorage.getItem('schoolUserName');
    let instituteUserName = localStorage.getItem('instituteUserName');
    // let classCode = formInfo.value.viewClassName;
    // let subjectCode = formInfo.value.viewSubject;
    let currentDate: Date = new Date();
    let createdOn = `${ currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`;
    this.loadingIndicator.show();
    // console.log(this.viewAttendanceForm.value);

    this.dataService.getAttendance({ instituteUserName, schoolUserName, createdOn })
      .then((resp) => {
        this.loadingIndicator.hide();
        if (resp.json().success) {
          this.attendanceInfo = [];
          if (resp.json().attendanceInfo.length == 0){
             this.toastr.error(`No Records Found`);
            } 
          else{
            let studentsInfo = resp.json().attendanceInfo[0].presentiesList;
            let fullClsList = studentsInfo.map(item =>{
              return item.classCode 
            });
            let fileredClsList = fullClsList.filter((v, i, a) => a.indexOf(v) === i); 
            this.classChartLabels = [];
            
            fileredClsList.map(item => {
              let cArr = this.classesList.filter(cls => cls._id == item )
              if(cArr.length>0) this.classChartLabels.push(cArr[0].className);
            });

            let fileredStdList = studentsInfo.filter((v, i) => v)
            console.log('fileredStdList', fileredStdList, this.classChartLabels);
            this.classChartData = [
              {data: [10, 11, 20, 25], label:'Present', backgroundColor: '#00a65a'},
              // {data: [11, 11, 11, 40], label:'Absent', backgroundColor: '#3c8dbc'},
              // {data: [11, 22, 22, 55], label:'Leave', backgroundColor: '#f39c12'}
            ];
          }
        } else this.toastr.error(`${resp.json().message}`); 
      }).catch((err) => {
        console.log(err)
        this.loadingIndicator.hide();
        // this.error = err.json().message
        this.toastr.error(`${err.json().message}`);
      });
  }

}
