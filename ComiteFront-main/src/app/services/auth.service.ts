import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, tap } from 'rxjs';
import { DatosCaso } from '../models/datos-caso';
import { FormBuilder, FormGroup } from '@angular/forms';


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

  registrarCaso(datosCaso: any): Observable<any> {
    return this.http.post<any>(this.URL+ '/create/alumno', datosCaso);
  }
 // Método para mostrar los datos de la colección "Alumno"
 getAlumnos(): Observable<any[]> {
  return this.http.get<any[]>(`${this.URL}/get/alumnos`);
}
// Metodo para mover un registro a la coleccion de reciclaje "Alumno"
moverAlumno(alumnoId: string): Observable<any> {
  const url = `${this.URL}/reciclaje/alumno/${alumnoId}`;
  return this.http.post(url, {});
}
getAlumnosReciclaje(): Observable<any[]> {
  return this.http.get<any[]>(`${this.URL}/get/reciclaje/alumnos`);
}
restaurarAlumno(alumnoId: string): Observable<any> {
  const url = `${this.URL}/restaurar/alumno/${alumnoId}`;
  return this.http.post(url, {});
}
// Metodo para mover un registro a la coleccion de Aceptados "Alumno"
aceptarAlumno(alumnoId: string): Observable<any> {
  const url = `${this.URL}/aceptar/alumnos/${alumnoId}`;
  return this.http.post(url, {});
}
// Metodo para mostrar a la coleccion de Aceptados 
getAceptadosAlumnos(): Observable<any[]> {
  return this.http.get<any[]>(`${this.URL}/get/aceptados/alumnos`);
}
// Metodo para mostrar a la coleccion de USERS
getAllUsers(): Observable<any[]> {
  return this.http.get<any[]>(`${this.URL}/users/get`);
}
deleteUser(userId: string): Observable<any> {
  const url = `${this.URL}/users/delete/${userId}`;
  return this.http.delete(url);
}
updateUsuario(id: string, datosUsuario: any): Observable<any> {
  const url = `${this.URL}/users/update/${id}`;
  return this.http.put(url, datosUsuario);
}

createUser(newUser: any): Observable<any> {
  return this.http.post<any>(`${this.URL}/users/create`, newUser);
}

}


