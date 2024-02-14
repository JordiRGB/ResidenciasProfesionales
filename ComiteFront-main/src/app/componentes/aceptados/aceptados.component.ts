import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';

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
  pdfPath: string; // Propiedad pdfPath para mantener la ruta del PDF
  updatedAt: Date;
}

@Component({
  selector: 'app-aceptados',
  templateUrl: './aceptados.component.html',
  styleUrls: ['./aceptados.component.css']
})
export class AceptadosComponent implements OnInit {
  Alumno: Alumno[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.getAlumnosAceptados();
  }
  getAlumnosAceptados() {
    this.authService.getAlumnosAceptados().subscribe(
      (response: any) => {
        console.log('Datos de alumnos aceptados:', response);
        if (Array.isArray(response.alumnos)) {
          this.Alumno = response.alumnos.map(alumno => {
            return { 
              ...alumno, 
              pdfPath: `${alumno.evidencia.url}` // Usamos la propiedad url
            };
          });
        } else {
          console.error('La propiedad "alumnos" en la respuesta del servicio no es un array:', response);
        }
      },
      (error) => {
        console.error('Error obteniendo alumnos aceptados', error);
        Swal.fire('Error', 'Error obteniendo alumnos aceptados', 'error');
      }
    );
  }

  verPDF(pdfPath: string) {
    window.open(pdfPath, '_blank');
  }

  rechazarAlumno(id: string): void {
    Swal.fire({
      title: 'Motivo de Rechazo',
      input: 'text',
      inputLabel: 'Ingrese el motivo de rechazo',
      inputValidator: (value) => {
        if (!value) {
          return 'El motivo de rechazo es requerido';
        }
        return null;
      },
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Rechazar',
    }).then((result) => {
      if (result.isConfirmed) {
        const motivoRechazo = result.value;

        this.authService.rechazarAlumnoComi(id, motivoRechazo).subscribe(
          (response) => {
            console.log('Alumno rechazado con éxito', response);
            Swal.fire('Éxito', 'Alumno rechazado con éxito', 'success');
          },
          (error) => {
            console.error('Error al rechazar el alumno', error);
            Swal.fire('Error', 'Error al rechazar el alumno', 'error');
          }
        );
      }
    });
  }
  aceptarAlumno(id: string): void {
    this.authService.aceptarAlumnoComi(id).subscribe(
      response => {
        Swal.fire('Éxito', 'El alumno ha sido aceptado exitosamente', 'success' );
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      },
      error => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al aceptar al alumno jefe. Por favor, inténtalo de nuevo.'
        });
        console.error('Error al aceptar alumno jefe:', error);
      }
    );
  }
  }
  
 

