import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';

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
}

@Component({
  selector: 'app-jefeisc',
  templateUrl: './jefeisc.component.html',
  styleUrls: ['./jefeisc.component.css']
})
export class JefeiscComponent implements OnInit {
  Alumno: Alumno[] = [];
  motivo: string = '';

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.getAlumnos();
  }

  getAlumnos() {
    this.authService.getAlumnos().subscribe(
      (data: Alumno[]) => {
        console.log('Datos de alumnos:', data);

        this.Alumno = data.map(alumno => {
          return { 
            ...alumno, 
            pdfPath: `${alumno.evidencia.url}` // Ahora usamos la propiedad url
          };
        });
      },
      (error) => {
        console.error('Error obteniendo alumnos', error);
      }
    );
  }

  // Método para visualizar el PDF de un alumno
  verPDF(pdfPath: string) {
    // Abrir una nueva ventana para mostrar el PDF
    window.open(pdfPath, '_blank');
  }

  moverAlumnoAlReciclaje(alumnoId: string): void {
    this.authService.moverAlumno(alumnoId).subscribe(
      (data) => {
        // Mostrar mensaje de éxito con SweetAlert2
        Swal.fire('Éxito', 'Alumno movido a la papelera', 'success');

        // Esperar 3 segundos y luego recargar la página
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      },
      (error) => {
        console.error('Error moviendo alumno al reciclaje:', error);

        // Verifica el tipo de error
        if (error instanceof HttpErrorResponse) {
          console.error('Estado del error:', error.status);
          console.error('Mensaje del error:', error.error);
        }

        // Mostrar mensaje de error con SweetAlert2
        Swal.fire('Error', 'Error al mover el alumno a la papelera', 'error');
      }
    );
  }
  
  rechazarSolicitudAlumno(id: string): void {
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

        this.authService.rechazarSolicitudAlumno(id, motivoRechazo).subscribe(
          (response) => {
            console.log('Solicitud rechazada con éxito', response);

            Swal.fire('Éxito', 'Solicitud rechazada con éxito', 'success');
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          },
          (error) => {
            console.error('Error al rechazar la solicitud', error);
            Swal.fire('Error', 'Error al rechazar la solicitud', 'error');
          }
        );
      }
    });
  }
  aceptarAlumnoJefe(id: string): void {
    this.authService.aceptarAlumnoJefe(id).subscribe(
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
            // Aquí puedes manejar el error según sea necesario
        }
    );
}

  }
 
