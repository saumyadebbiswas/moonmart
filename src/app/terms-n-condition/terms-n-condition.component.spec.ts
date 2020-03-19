import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsNConditionComponent } from './terms-n-condition.component';

describe('TermsNConditionComponent', () => {
  let component: TermsNConditionComponent;
  let fixture: ComponentFixture<TermsNConditionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TermsNConditionComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TermsNConditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
