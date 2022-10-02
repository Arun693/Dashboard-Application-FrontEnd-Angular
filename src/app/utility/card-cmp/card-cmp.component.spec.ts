import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardCmpComponent } from './card-cmp.component';

describe('CardCmpComponent', () => {
  let component: CardCmpComponent;
  let fixture: ComponentFixture<CardCmpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardCmpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardCmpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
