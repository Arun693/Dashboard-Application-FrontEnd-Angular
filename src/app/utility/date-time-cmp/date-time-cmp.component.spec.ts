import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DateTimeCmpComponent } from './date-time-cmp.component';

describe('DateTimeCmpComponent', () => {
  let component: DateTimeCmpComponent;
  let fixture: ComponentFixture<DateTimeCmpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DateTimeCmpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DateTimeCmpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
