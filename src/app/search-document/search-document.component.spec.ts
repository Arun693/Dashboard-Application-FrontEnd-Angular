import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchDocumentComponent } from './search-document.component';

describe('SearchDocumentComponent', () => {
  let component: SearchDocumentComponent;
  let fixture: ComponentFixture<SearchDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
