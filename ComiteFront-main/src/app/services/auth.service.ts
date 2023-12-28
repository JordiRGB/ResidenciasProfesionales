import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private URL= 'http://localhost:4000/api'

  constructor(private http: HttpClient) { }

  signUp(user: any){
    return this.http.post<any>(this.URL+ '/users/signup', user);
  }
  signIn(user: any){
    return this.http.post<any>(this.URL+ '/users/signin', user);
  }
  registrarCaso(datosCaso: any): Observable<any> {
    return this.http.post<any>(this.URL+ '/create/alumno',datosCaso);
  }

 // Método para mostrar los datos de la colección "Alumno"
 getAlumnos(): Observable<any[]> {
  return this.http.get<any[]>(`${this.URL}/get/alumnos`);
}

  
}
