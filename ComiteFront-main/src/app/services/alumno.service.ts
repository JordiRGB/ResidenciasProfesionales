import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlumnoService {
  private URL = 'http://localhost:4000/api';

  constructor(private http: HttpClient) { }

 // Método para obtener todos los alumnos
 getAlumnos(): Observable<any[]> {
  return this.http.get<any[]>(`${this.URL}/alumnos`);
}

// Método para mover un alumno a la colección de reciclaje
moverAlumnoAlReciclaje(alumnoId: string): Observable<any> {
  const url = `${this.URL}/alumnos/${alumnoId}/reciclaje`;
  return this.http.post(url, {});
}

// Método para obtener todos los alumnos en la colección de reciclaje
getAlumnosReciclaje(): Observable<any[]> {
  return this.http.get<any[]>(`${this.URL}/reciclaje/alumnos`);
}

// Método para restaurar un alumno desde la colección de reciclaje
restaurarAlumno(alumnoId: string): Observable<any> {
  const url = `${this.URL}/reciclaje/alumnos/${alumnoId}/restaurar`;
  return this.http.post(url, {});
}
  // Método para rechazar la solicitud de un alumno
  rechazarSolicitudAlumno(id: string, motivoRechazo: string): Observable<any> {
    const url = `${this.URL}/alumnos/${id}/rechazar`;
    return this.http.put(url, { motivoRechazo });
  }
}
