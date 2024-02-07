import { TestBed } from '@angular/core/testing';

import { AlumnoAceptService } from './alumno-acept.service';

describe('AlumnoAceptService', () => {
  let service: AlumnoAceptService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlumnoAceptService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
