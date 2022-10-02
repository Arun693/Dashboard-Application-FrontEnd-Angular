import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditDetailsComponent } from './add-edit-details.component';

describe('AddEditDetailsComponent', () => {
  let component: AddEditDetailsComponent;
  let fixture: ComponentFixture<AddEditDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
