import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagActaTwoComponent } from './pag-acta-two.component';

describe('PagActaTwoComponent', () => {
  let component: PagActaTwoComponent;
  let fixture: ComponentFixture<PagActaTwoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PagActaTwoComponent]
    });
    fixture = TestBed.createComponent(PagActaTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});