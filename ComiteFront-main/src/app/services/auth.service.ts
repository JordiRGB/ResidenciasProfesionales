  import { Injectable } from '@angular/core';
  import {HttpClient, HttpHeaders} from '@angular/common/http';
  import { BehaviorSubject, Observable, catchError, tap } from 'rxjs';
  import { DatosCaso } from '../models/datos-caso';
  import { Form, FormBuilder, FormGroup } from '@angular/forms';
  import { Buffer } from 'buffer';



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
    
    //registrar el caso para subir los pdf
    registrarCaso(datosCaso: FormData, evidencia: Buffer): Observable<any> {
      const formData = new FormData();
      formData.append('matricula', datosCaso.get('matricula')!.toString());
      formData.append('nombreCom', datosCaso.get('nombreCom')!.toString());
      formData.append('telefono', datosCaso.get('telefono')!.toString());
      formData.append('direccion', datosCaso.get('direccion')!.toString());
      formData.append('carrera', datosCaso.get('carrera')!.toString());
      formData.append('casoEsta', datosCaso.get('casoEsta')!.toString());
      formData.append('casoTipo', datosCaso.get('casoTipo')!.toString());
      formData.append('semestre', datosCaso.get('semestre')!.toString());
      formData.append('correo', datosCaso.get('correo')!.toString());
      formData.append('motivosAca', datosCaso.get('motivosAca')!.toString());
      formData.append('motivosPer', datosCaso.get('motivosPer')!.toString());
    
      // Agrega la evidencia como un ArrayBuffer a FormData
      formData.append('evidencia', new Blob([evidencia]), 'evidencia.pdf');
    
      const options = {
        headers: new HttpHeaders({
          'Accept': 'application/json, multipart/form-data'
        })
      };
    
      return this.http.post(`${this.URL}/create/alumno`, formData, options);
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
rechazarSolicitudAlumno(id: string, motivoRechazo: string): Observable<any> {
  const url = `${this.URL}/rechazar/alumnoJefes/${id}`;
  const body = { motivoRechazo };
  return this.http.put(url, body);
}
rechazarAlumnoComi(id: string, motivoRechazo: string): Observable<any> {
  const url = `${this.URL}/rechazar/alumnoComi/${id}`;
  const body = { motivoRechazo };
  return this.http.put(url, body);
}
aceptarAlumnoJefe(id: string): Observable<any> {
  return this.http.put(`${this.URL}/aceptar/alumnoJefes/${id}`, {});
}
aceptarAlumnoComi(id: string): Observable<any> {
  return this.http.put(`${this.URL}/aceptar/alumnoComi/${id}`, {});
}
getRoles(): Observable<string[]> {
  return this.http.get<string[]>(`${this.URL}/roles/get`);
}
getAlumnosAceptados(): Observable<any[]> {
  return this.http.get<any[]>(`${this.URL}/get/alumnos/aceptados`);
}
}