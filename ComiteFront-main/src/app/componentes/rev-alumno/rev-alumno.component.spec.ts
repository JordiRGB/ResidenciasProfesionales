import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevAlumnoComponent } from './rev-alumno.component';

describe('RevAlumnoComponent', () => {
  let component: RevAlumnoComponent;
  let fixture: ComponentFixture<RevAlumnoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RevAlumnoComponent]
    });
    fixture = TestBed.createComponent(RevAlumnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
