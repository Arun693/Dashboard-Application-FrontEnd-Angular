import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortalBaseComponent } from './portal-base.component';

describe('PortalBaseComponent', () => {
  let component: PortalBaseComponent;
  let fixture: ComponentFixture<PortalBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortalBaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortalBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
