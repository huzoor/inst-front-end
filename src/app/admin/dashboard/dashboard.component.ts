import { Component, OnInit } from '@angular/core';
// import {AccordionModule} from 'primeng/accordion';
import { DataService } from '../../shared/data.service';
import { NgxSpinnerService } from 'ngx-spinner';

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
  public studentsLists: any[] = new Array();
  constructor(private dataService: DataService, private loadingIndicator: NgxSpinnerService) { }

  ngOnInit() {
    AdminLTE.init();
    this.classChartLabels = ['I Class', 'II Class', 'III Class', 'IV Class'];
    this.classChartData = [
      {data: [10, 11, 20, 25], label:'Present', backgroundColor: '#00a65a'},
      {data: [11, 11, 11, 40], label:'Absent', backgroundColor: '#3c8dbc'},
      {data: [11, 22, 22, 55], label:'Leave', backgroundColor: '#f39c12'}
    ];

    this.marksLabel = ['Pass', 'Failure', 'Absent'];
    this.marksData = [80, 15, 5];
    this.userRole = parseInt(localStorage.getItem('role'),10)

    if(this.userRole === 104){
      let studentsCount = parseInt(localStorage.getItem('studentsCount'),10);
      let userName = localStorage.getItem('studentUserName');
      if(studentsCount > 1){
        this.dataService.getStudentsListById({userName})
        .then((resp) => {
          if (resp.json().success) {
            this.loadingIndicator.hide();
            console.log('Inst Loaded ', resp.json().studentsList);
            this.studentsLists = resp.json().studentsList;
          } else {
            this.loadingIndicator.hide();
          
          }
        });
      }
    }
  }

  chartHovered($eve){}
  chartClicked($eve){}

  changeStudent(studentId){
    let currentStudent = this.studentsLists.filter(item=> item._id == studentId);
    // console.log(currentStudent);
    this.getStaffByClassId(currentStudent[0].classEnrolled, 
                           currentStudent[0].instituteUserName, 
                           currentStudent[0].schoolUserName)


    localStorage.setItem('instituteUserName',currentStudent[0].instituteUserName);
    localStorage.setItem('schoolUserName',currentStudent[0].schoolUserName);
    localStorage.setItem('studentId', currentStudent[0]._id);
    localStorage.setItem('name',currentStudent[0].name);
    localStorage.setItem('staffId','');
    document.getElementById('studentInfoName').innerText = currentStudent[0].name;
    document.getElementById('studentInfoTopRight').innerText = currentStudent[0].name;
    document.getElementById('studentInfoTopRightBox').innerText = currentStudent[0].name;
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

}
