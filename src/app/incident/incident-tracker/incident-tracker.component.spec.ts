import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentTrackerComponent } from './incident-tracker.component';

describe('IncidentTrackerComponent', () => {
  let component: IncidentTrackerComponent;
  let fixture: ComponentFixture<IncidentTrackerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncidentTrackerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
