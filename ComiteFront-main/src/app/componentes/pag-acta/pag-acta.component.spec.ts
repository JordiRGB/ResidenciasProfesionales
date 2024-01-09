import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagActaComponent } from './pag-acta.component';

describe('PagActaComponent', () => {
  let component: PagActaComponent;
  let fixture: ComponentFixture<PagActaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PagActaComponent]
    });
    fixture = TestBed.createComponent(PagActaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
