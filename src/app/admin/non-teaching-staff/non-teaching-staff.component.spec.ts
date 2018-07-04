import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NonTeachingStaffComponent } from './non-teaching-staff.component';

describe('NonTeachingStaffComponent', () => {
  let component: NonTeachingStaffComponent;
  let fixture: ComponentFixture<NonTeachingStaffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NonTeachingStaffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NonTeachingStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
