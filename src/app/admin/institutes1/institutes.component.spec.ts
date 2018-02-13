import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstitutesComponent } from './institutes.component';

describe('InstitutesComponent', () => {
  let component: InstitutesComponent;
  let fixture: ComponentFixture<InstitutesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstitutesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstitutesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
