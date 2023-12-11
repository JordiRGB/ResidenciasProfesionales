import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JefeiscComponent } from './jefeisc.component';

describe('JefeiscComponent', () => {
  let component: JefeiscComponent;
  let fixture: ComponentFixture<JefeiscComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JefeiscComponent]
    });
    fixture = TestBed.createComponent(JefeiscComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
