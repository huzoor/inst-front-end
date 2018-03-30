import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentAcademicSetupComponent } from './student-academic-setup.component';

describe('StudentAcademicSetupComponent', () => {
  let component: StudentAcademicSetupComponent;
  let fixture: ComponentFixture<StudentAcademicSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentAcademicSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentAcademicSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
