  import { Injectable } from '@angular/core';
  import {HttpClient, HttpHeaders} from '@angular/common/http';
  import { BehaviorSubject, Observable, catchError, tap } from 'rxjs';
  import { DatosCaso } from '../models/datos-caso';
  import { Form, FormBuilder, FormGroup } from '@angular/forms';


  @Injectable({
    providedIn: 'root'
    
  })

  export class AuthService {
    private URL = 'http://localhost:4000/api';

    // Nuevo BehaviorSubject para almacenar los datos del caso
    private datosCasoSubject = new BehaviorSubject<FormGroup>(this.formBuilder.group({} as DatosCaso));
    datosCaso$ = this.datosCasoSubject.asObservable();
    
    constructor(private http: HttpClient, private formBuilder: FormBuilder) {}

    get datosCasoForm(): FormGroup {
      return this.datosCasoSubject.value;
    }

    initDatosCasoForm(): void {
      this.datosCasoSubject.next(this.formBuilder.group({} as DatosCaso));
    }

    signUp(user: any): Observable<any> {
      return this.http.post<any>(this.URL + '/users/signup', user);
    }

    signIn(user: any): Observable<any> {
      return this.http.post<any>(this.URL + '/users/signin', user);
    }
    
    registrarCaso(datosCaso: FormData): Observable<any> {
      const options = {
        headers: new HttpHeaders({
          'Content-Type': 'multipart/form-data'
        })
      };
      return this.http.post(this.URL + '/create/alumno', datosCaso, options);
    }

    // Método para mostrar los datos de la colección "Alumno"
    getAlumnos(): Observable<any[]> {
      return this.http.get<any[]>(`${this.URL}/get/alumnos`);
    }
}

