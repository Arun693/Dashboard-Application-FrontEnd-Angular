import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateIncidentComponent } from './create-incident.component';

describe('CreateIncidentComponent', () => {
  let component: CreateIncidentComponent;
  let fixture: ComponentFixture<CreateIncidentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateIncidentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateIncidentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
