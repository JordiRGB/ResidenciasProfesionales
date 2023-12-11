import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagSignUpComponent } from './pag-sign-up.component';

describe('PagSignUpComponent', () => {
  let component: PagSignUpComponent;
  let fixture: ComponentFixture<PagSignUpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PagSignUpComponent]
    });
    fixture = TestBed.createComponent(PagSignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
