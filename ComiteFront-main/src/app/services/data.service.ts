import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private textoGuardado: string = '';
  private tipoSesion: string = '';

  setTextoGuardado(texto: string): void {
    this.textoGuardado = texto;
    
  }

  getTextoGuardado(): string {
    return this.textoGuardado;
  }
  setTipoSesion(tipoSesion: string): void {
    this.tipoSesion = tipoSesion;
  }

  getTipoSesion(): string {
    return this.tipoSesion;
  }
}
