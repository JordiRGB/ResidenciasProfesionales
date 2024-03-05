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
  createdAt: Date;
}

@Component({
  selector: 'app-aceptados',
  templateUrl: './aceptados.component.html',
  styleUrls: ['./aceptados.component.css']
})
export class AceptadosComponent implements OnInit {
  Alumno: Alumno[] = [];
  userEmail: string | null = ''; 
  showLogoutOption: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.userEmail = localStorage.getItem('userEmail');
    this.getAlumnosAceptados();
  }
  logout() {
    // Mostrar alerta de confirmación usando SweetAlert2
    Swal.fire({
      title: '¿Seguro que quieres cerrar sesión?',
      text: 'Tu sesión actual se cerrará',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Lógica para cerrar sesión
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        // Redireccionar a la página de inicio de sesión
        window.location.href = '/ruta-de-inicio-de-sesion'; // Reemplaza '/ruta-de-inicio-de-sesion' con la ruta real de tu página de inicio de sesión
      }
    });
  }
  getAlumnosAceptados() {
    this.authService.getAlumnosAceptados().subscribe(
      (response: any[]) => {
        console.log('Datos de alumnos aceptados:', response);
        this.Alumno = response.map(alumno => {
          return { 
            ...alumno, 
            pdfPath: `${alumno.evidencia.url}` // Usamos la propiedad url
          };
        });
      },
      (error) => {
        console.error('Error obteniendo alumnos aceptados', error);
        // Aquí podrías mostrar un mensaje de error al usuario
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
  buscarPorMatricula(event: Event) {
    const matricula = (event.target as HTMLInputElement).value;
    if (matricula === '') {
        this.getAlumnosAceptados(); // Si el campo está vacío, mostrar todos los alumnos
    } else {
        this.Alumno = this.Alumno.filter(alumno => alumno.matricula.toString().includes(matricula));
    }
  }
}