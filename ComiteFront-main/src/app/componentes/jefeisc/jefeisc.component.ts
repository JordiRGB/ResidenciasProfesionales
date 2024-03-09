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
  userEmail: string | null = ''; 
  carreraSeleccionada: string = ''; // Variable para almacenar la carrera asociada al usuario


  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.userEmail = localStorage.getItem('userEmail');
    if (this.userEmail === 'jefatura.sistemas@tesch.edu.mx') {
      this.carreraSeleccionada = 'Ingeniería en Sistemas Computacionales';
      this.getAlumnosJefes(this.carreraSeleccionada);
    } else if (this.userEmail === 'jefatura.industrial@tesch.edu.mx') {
      this.carreraSeleccionada = 'Ingeniería Industrial';
      this.getAlumnosJefes(this.carreraSeleccionada);
    } else if (this.userEmail === 'jefatura.electromecanica@tesch.edu.mx') {
      this.carreraSeleccionada = 'Ingeniería Electromecánica';
      this.getAlumnosJefes(this.carreraSeleccionada);
    } else if (this.userEmail === 'jefatura.electronica@tesch.edu.mx') {
      this.carreraSeleccionada = 'Ingeniería Electrónica';
      this.getAlumnosJefes(this.carreraSeleccionada);
    }else if (this.userEmail === 'jefatura.informatica@tesch.edu.mx') {
      this.carreraSeleccionada = 'Ingeniería Informática';
      this.getAlumnosJefes(this.carreraSeleccionada);
    }else if (this.userEmail === 'jefatura_admon@tesch.edu.mx') {
      this.carreraSeleccionada = 'Ingeniería en Administración';
      this.getAlumnosJefes(this.carreraSeleccionada);
    }
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

  getAlumnosJefes(carrera: string) {
    this.authService.getAlumnosJefes(carrera).subscribe(
      (data: Alumno[]) => {
        console.log('Datos de alumnos jefes:', data);
        
        this.Alumno = data.map(alumno => {
          return { 
            ...alumno, 
            pdfPath:`${alumno.evidencia.url}`// Ahora usamos la propiedad url
          };
        });
      },
      (error) => {
        console.error('Error obteniendo alumnos jefes', error);
      }
    );
  }
  // Método para visualizar el PDF de un alumno
  verPDF(pdfPath: string) {
    // Abrir una nueva ventana para mostrar el PDF
    window.open(pdfPath, '_blank');
  }

  moverAlumnoAlReciclaje(alumnoId: string): void {
    Swal.fire({
        title: '¿Estás seguro?',
        text: 'Estás a punto de mover al alumno a la papelera. ¿Estás seguro de continuar?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, mover a la papelera',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
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
    });
}

  rechazarSolicitudAlumno(id: string, nombreCom: string): void {
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
    });
}

  aceptarAlumnoJefe(id: string, nombreCom: string): void {
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
        this.authService.aceptarAlumnoJefe(id).subscribe(
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
              text: 'Hubo un error al aceptar al alumno jefe. Por favor, inténtalo de nuevo.'
            });
            console.error('Error al aceptar alumno jefe:', error);
            // Aquí puedes manejar el error según sea necesario
          }
        );
      }
    });
  }
  mostrarInformacion(alumno: Alumno): void {
    Swal.fire({
      title: `Motivos de ${alumno.nombreCom}`,
      html: `<p><strong>Motivos Académicos:</strong> ${alumno.motivosAca}</p><p><strong>Motivos Personales:</strong> ${alumno.motivosPer}</p>`,
      icon: 'info'
    });
  }
  
  buscarPorMatricula(event: Event) {
    const matricula = (event.target as HTMLInputElement).value;
    if (matricula === '') {
      this.getAlumnosJefes(this.carreraSeleccionada); // Pasa el nombre de la carrera predeterminada si el campo está vacío
    } else {
      this.Alumno = this.Alumno.filter(alumno => alumno.matricula.toString().includes(matricula));
    }
  }
}
