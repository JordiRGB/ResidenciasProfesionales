import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private tipoSesion: string = '';
  private asistentesSeleccionados: any[] = [];
  private URL = 'http://localhost:4000/api'
  constructor(private http: HttpClient){}

  obtenerInformacionActa(): Observable<any> {
    return this.http.get<any>(this.URL + '/acta/number');
  }
  
  setTipoSesion(tipoSesion: string): void {
    this.tipoSesion = tipoSesion;
  }

  getTipoSesion(): string {
    return this.tipoSesion;
  }

  setAsistentesSeleccionados(asistentes: any[]): void {
    this.asistentesSeleccionados = asistentes;
  }

  getAsistentesSeleccionados(): any[] {
    return this.asistentesSeleccionados;
  }
}
