import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

interface Alumno {
  _id: string;
  matricula: number;
  nombreCom: string;
  telefono: number;
  casoEsta: string;
  direccion: string;
  carrera: string;
  casoTipo: string;
  semestre: number;
  correo: string;
  motivosAca: string;
  motivosPer: string;
  evidencia: {
    contentType: string;
    fileName: string;
    url: string; // Agregar la propiedad url al tipo evidencia
  };
  motivoRechazo: string;
  rechazado: boolean;
  pdfPath: string; // Propiedad pdfPath para mantener la ruta del PDF
  updatedAt: Date;
}

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css']
})
export class HistorialComponent  implements OnInit{
  Alumno: Alumno[] = [];

  constructor(private authService: AuthService){

  }
  ngOnInit(): void {
    this.obtenerHistorialJefe();
  }
  obtenerHistorialJefe() {
    this.authService.obtenerHistorialCasos().subscribe(
      (response: any) => {
        console.log('Datos de historial del jefe:', response);
        if (Array.isArray(response.historialJefe)) {
          this.Alumno = response.historialJefe.map((alumno: any) => {
            return {
              _id: alumno._id,
              matricula: alumno.matricula,
              nombreCom: alumno.nombreCom,
              telefono: alumno.telefono,
              casoEsta: alumno.casoEsta,
              direccion: alumno.direccion,
              carrera: alumno.carrera,
              casoTipo: alumno.casoTipo,
              semestre: alumno.semestre,
              correo: alumno.correo,
              motivosAca: alumno.motivosAca,
              motivosPer: alumno.motivosPer,
              evidencia: alumno.evidencia,
              motivoRechazo: alumno.motivoRechazo,
              rechazado: alumno.rechazado,
              pdfPath: `${alumno.evidencia.url}`, // Agregar la propiedad pdfPath
              updatedAt: alumno.updatedAt
            };
          });
        } else {
          console.error('La propiedad "historialJefe" en la respuesta del servicio no es un array:', response);
        }
      },
      (error) => {
        console.error('Error al obtener el historial del jefe:', error);
      }
    );
  }

  verPDF(pdfPath: string) {
    window.open(pdfPath, '_blank');
  }
}
