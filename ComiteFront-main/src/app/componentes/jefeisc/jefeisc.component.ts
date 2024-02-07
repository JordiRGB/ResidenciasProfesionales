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
  motivo: string = '';

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
  aceptarAlumno(idAlumno: string) {
    this.authService.aceptarAlumno(idAlumno).subscribe(
      (response) => {
        // Mostrar mensaje de éxito con SweetAlert2
        Swal.fire('Éxito', 'Alumno aceptado correctamente', 'success');

        // Actualizar la lista de alumnos después de aceptar uno
        this.getAlumnos();
      },
      (error) => {
        console.error('Error al aceptar alumno:', error);
        // Mostrar mensaje de error con SweetAlert2
        Swal.fire('Error', 'Error al aceptar alumno', 'error');
      }
    );
  }

  rechazarAlumno(idAlumno: string, motivo: string) {
    this.authService.rechazarAlumno(idAlumno, motivo).subscribe(
      (response) => {
        // Mostrar mensaje de éxito con SweetAlert2
        Swal.fire('Éxito', 'Alumno rechazado correctamente', 'success');

        // Actualizar la lista de alumnos después de rechazar uno
        this.getAlumnos();
      },
      (error) => {
        console.error('Error al rechazar alumno:', error);
        // Mostrar mensaje de error con SweetAlert2
        Swal.fire('Error', 'Error al rechazar alumno', 'error');
      }
    );
  }

 
}
