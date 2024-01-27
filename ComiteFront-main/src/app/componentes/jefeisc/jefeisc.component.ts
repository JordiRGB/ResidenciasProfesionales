import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
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
    evidencia: string;
    pdfPath: string;
    motivoRechazo: string;  
    rechazado: boolean;
  
  
}

@Component({
  selector: 'app-jefeisc',
  templateUrl: './jefeisc.component.html',
  styleUrls: ['./jefeisc.component.css']
})
export class JefeiscComponent implements OnInit {
  Alumno: Alumno[] = [];
  motivoRechazo: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.getAlumnos();
  }

  getAlumnos() {
    this.authService.getAlumnos().subscribe(
      (data: Alumno[]) => {
        console.log('Datos de alumnos:', data);

        this.Alumno = data.map(alumno => {
          const pdfPath = `uploads/${alumno.evidencia}`;
          console.log('pdfPath:', pdfPath);
          return { ...alumno, pdfPath };
        });
      },
      (error) => {
        console.error('Error obteniendo alumnos', error);
      }
    );
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

  aceptarAlumno(id: string, casoEsta: string): void {
    if (!this.esAlumnoRechazado(casoEsta)) {
      this.authService.aceptarAlumno(id).subscribe(
        response => {
          Swal.fire('Éxito', 'Alumno aceptado', 'success');
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        },
        error => {
          console.error('Error al aceptar al alumno', error);
        }
      );
    } else {
      Swal.fire('Error', 'Este alumno ha sido rechazado y no puede ser aceptado.', 'error');
    }
  }

  rechazarAlumno(id: string, casoEsta: string): void {
    if (!this.esAlumnoRechazado(casoEsta)) {
      Swal.fire({
        title: 'Motivo de Rechazo',
        input: 'text',
        showCancelButton: true,
        confirmButtonText: 'Rechazar',
        cancelButtonText: 'Cancelar',
        inputValidator: (value: string) => {
          if (!value.trim()) {
            return 'Debes ingresar un motivo de rechazo';
          }
          return null;
        }
      }).then((result) => {
        if (result.isConfirmed) {
          const motivoRechazo = result.value;
  
          // Llama al servicio para actualizar el alumno con el motivo de rechazo
          this.authService.updateAlumno(id, { motivoRechazo }).subscribe(
            response => {
              const alumnoRechazado = this.Alumno.find(alumno => alumno._id === id);
              if (alumnoRechazado) {
                alumnoRechazado.rechazado = true;
                alumnoRechazado.casoEsta = 'Rechazado';  // Asegúrate de actualizar el estado
                alumnoRechazado.motivoRechazo = motivoRechazo;  // Actualiza el motivo de rechazo
              }
  
              Swal.fire('Éxito', 'Alumno rechazado correctamente', 'success');
            },
            error => {
              // Maneja el error y muestra una alerta de error si es necesario
              console.error('Error al actualizar alumno:', error);
              Swal.fire('Error', 'Error al rechazar al alumno', 'error');
            }
          );
        }
      });
    } else {
      Swal.fire('Advertencia', 'Este alumno ya ha sido rechazado.', 'warning');
    }
  }
  

  private esAlumnoRechazado(casoEsta: string): boolean {
    return casoEsta.toLowerCase() === 'rechazado';
  }
}
