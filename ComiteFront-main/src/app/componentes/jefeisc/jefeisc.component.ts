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

  constructor(private authService: AuthService) {
    
  }
  

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
    if (this.esAlumnoRechazado(casoEsta)) {
      Swal.fire('Error', 'Este alumno ya ha sido rechazado y no puede ser aceptado nuevamente.', 'error');
      return;
    }
    if (this.authService.esAlumnoAceptado(casoEsta)) {
      Swal.fire('Error', 'Este alumno ya ha sido aceptado y no puede ser aceptado nuevamente.', 'error');
      return;
    }
  
  
    this.authService.aceptarAlumno(id).subscribe(
      (response) => {
        console.log('Alumno aceptado con éxito', response);
  
        Swal.fire('Éxito', 'Alumno aceptado con éxito', 'success');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      },
      (error) => {
        console.error('Error al aceptar al alumno', error);
        Swal.fire('Error', 'Error al aceptar el alumno', 'error');
      }
    );
  }
  
  //botón de rechazo
  rechazarAlumno(alumnoId: string, casoEsta: string): void {
    if (this.esAlumnoRechazado(casoEsta)) {
      Swal.fire('Error', 'Este alumno ya ha sido rechazado y no puede ser rechazado nuevamente.', 'error');
      return;
    }
  
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
  
        this.authService.rechazarAlumno(alumnoId, motivoRechazo).subscribe(
          (response) => {
            console.log('Alumno rechazado con éxito', response);
  
            Swal.fire('Éxito', 'Alumno rechazado con éxito', 'success');
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          },
          (error) => {
            console.error('Error al rechazar al alumno', error);
            Swal.fire('Error', 'Error al rechazar el alumno', 'error');
          }
        );
      }
    });
  }
  
  
  private esAlumnoRechazado(casoEsta: string): boolean {
    return casoEsta.toLowerCase() === 'rechazado';
  }
  
}
