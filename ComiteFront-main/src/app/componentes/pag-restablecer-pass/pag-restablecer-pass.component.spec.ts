import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagRestablecerPassComponent } from './pag-restablecer-pass.component';

describe('PagRestablecerPassComponent', () => {
  let component: PagRestablecerPassComponent;
  let fixture: ComponentFixture<PagRestablecerPassComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PagRestablecerPassComponent]
    });
    fixture = TestBed.createComponent(PagRestablecerPassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
