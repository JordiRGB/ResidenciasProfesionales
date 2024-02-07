import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlumnoAceptService {
  private URL= 'http://localhost:4000/api'

  constructor(private http: HttpClient) { }

  getAlumnosAceptados(): Observable<any[]> {
    return this.http.get<any[]>(this.URL+"/get/aceptados/alumnos");
  }
}
