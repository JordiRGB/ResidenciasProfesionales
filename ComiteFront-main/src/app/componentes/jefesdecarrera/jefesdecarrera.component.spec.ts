import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JefesdecarreraComponent } from './jefesdecarrera.component';

describe('JefesdecarreraComponent', () => {
  let component: JefesdecarreraComponent;
  let fixture: ComponentFixture<JefesdecarreraComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JefesdecarreraComponent]
    });
    fixture = TestBed.createComponent(JefesdecarreraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
