import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeMultiSelectionComponent } from './employee-multi-selection.component';

describe('EmployeeMultiSelectionComponent', () => {
  let component: EmployeeMultiSelectionComponent;
  let fixture: ComponentFixture<EmployeeMultiSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeMultiSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeMultiSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
