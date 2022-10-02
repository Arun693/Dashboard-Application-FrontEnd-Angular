import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUserDetailsComponent } from './edit-user-details.component';

describe('EditUserDetailsComponent', () => {
  let component: EditUserDetailsComponent;
  let fixture: ComponentFixture<EditUserDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditUserDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditUserDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
