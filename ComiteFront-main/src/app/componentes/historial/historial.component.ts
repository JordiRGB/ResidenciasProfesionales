import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
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
  userEmail: string | null = ''; 
  showLogoutOption: boolean = false;


  constructor(private authService: AuthService){

  }
  ngOnInit(): void {
    this.userEmail = localStorage.getItem('userEmail');
    this.obtenerHistorialJefe();
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

  buscarPorMatricula(event: Event) {
    const matricula = (event.target as HTMLInputElement).value;
    if (matricula === '') {
        this.obtenerHistorialJefe(); // Si el campo está vacío, mostrar todos los alumnos
    } else {
        this.Alumno = this.Alumno.filter(alumno => alumno.matricula.toString().includes(matricula));
    }
  }
}
