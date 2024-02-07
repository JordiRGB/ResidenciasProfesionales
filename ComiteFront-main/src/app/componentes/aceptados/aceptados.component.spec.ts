import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AceptadosComponent } from './aceptados.component';

describe('AceptadosComponent', () => {
  let component: AceptadosComponent;
  let fixture: ComponentFixture<AceptadosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AceptadosComponent]
    });
    fixture = TestBed.createComponent(AceptadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
