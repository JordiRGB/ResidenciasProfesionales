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
        window.location.href = '/login'; 
      }
    });
  }
  getAlumnosAceptados() {
    this.authService.getAlumnosAceptados().subscribe(
      (response: any[]) => {
        console.log('Datos de alumnos aceptados:', response);
        if (response.length > 0) {
          this.Alumno = response.map(alumno => {
            return { 
              ...alumno, 
              pdfPath: `${alumno.evidencia.url}` // Usamos la propiedad url
            };
          });
        } else {
          // Mostrar una alerta si no se encontraron registros
          Swal.fire('Información', 'No se encontraron alumnos aceptados', 'info');
        }
      },
      (error) => {
        console.error('Error obteniendo alumnos aceptados', error);
        // Mostrar una alerta en caso de error
        Swal.fire('Error', 'Error obteniendo alumnos aceptados', 'error');
      }
    );
  }
  
  verPDF(pdfPath: string) {
    window.open(pdfPath, '_blank');
  }

  rechazarAlumno(id: string, nombreCom:string): void {
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
          Swal.fire({
              title: '¿Estás seguro?',
              text: `Estás a punto de rechazar al alumno ${nombreCom}. ¿Estás seguro de continuar?`,
              icon: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Sí, rechazar',
              cancelButtonText: 'Cancelar'
          }).then((confirmResult) => {
              if (confirmResult.isConfirmed) {
                  const motivoRechazo = result.value;

                  this.authService.rechazarAlumnoComi(id, motivoRechazo).subscribe(
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
  });
  }
  aceptarAlumno(id: string, nombreCom:string): void {
    Swal.fire({
      title: 'Confirmación',
      text: `¿Estás seguro de que deseas aceptar al alumno ${nombreCom}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, aceptar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.aceptarAlumnoComi(id).subscribe(
          response => {
            Swal.fire('Éxito', 'El alumno ha sido aceptado exitosamente', 'success');
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          },
          error => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Hubo un error al aceptar al alumno por la secretaria del comite . Por favor, inténtalo de nuevo.'
            });
            console.error('Error al aceptar alumno :', error);
          }
        );
      }
    });
  }
  buscarPorMatricula(event: Event) {
    const matricula = (event.target as HTMLInputElement).value;
    if (matricula === '') {
        this.getAlumnosAceptados(); // Si el campo está vacío, mostrar todos los alumnos
    } else {
        this.Alumno = this.Alumno.filter(alumno => alumno.matricula.toString().includes(matricula));
    }
  }
  mostrarInformacion(alumno: Alumno): void {
    Swal.fire({
      title: `Motivos de ${alumno.nombreCom}`,
      html: `<p><strong>Motivos Académicos:</strong> ${alumno.motivosAca}</p><p><strong>Motivos Personales:</strong> ${alumno.motivosPer}</p>`,
      icon: 'info'
    });
  }
  }
  
 

