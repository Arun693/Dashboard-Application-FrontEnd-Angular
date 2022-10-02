import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackCmpComponent } from './back-cmp.component';

describe('BackCmpComponent', () => {
  let component: BackCmpComponent;
  let fixture: ComponentFixture<BackCmpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackCmpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackCmpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
