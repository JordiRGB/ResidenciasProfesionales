import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-papelera',
  templateUrl: './papelera.component.html',
  styleUrls: ['./papelera.component.css']
})
export class PapeleraComponent implements OnInit {
  alumnosReciclaje: any[] = [];
  alumno: any;
  userEmail: string | null = ''; 
  showLogoutOption: boolean = false;


  constructor(private authService: AuthService, private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.userEmail = localStorage.getItem('userEmail');
    this.getAlumnosReciclaje();
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

  getAlumnosReciclaje(): void {
    this.authService.getAlumnosReciclaje().subscribe(
      (data) => {
        console.log('Alumnos en reciclaje:', data);
        this.alumnosReciclaje = data.map(alumno => {
          // Asegúrate de que todos los objetos tengan la propiedad 'id'
          const id = alumno._id; // Cambia "_id" por "id" si es necesario
          if (!id) {
            console.error('Propiedad "id" no definida en un objeto alumno:', alumno);
          }
          return { ...alumno, id }; // Agrega "id" al objeto si existe
        });
      },
      (error) => {
        console.error('Error obteniendo alumnos en reciclaje', error);
      }
    );
  }

  restablecerAlumno(alumnoId: string): void {
    if (alumnoId) {
      this.authService.restaurarAlumno(alumnoId).subscribe(
        () => {
          // Mostrar mensaje de éxito con SweetAlert2 y cerrar después de 3 segundos
          Swal.fire({
            title: 'Éxito',
            text: 'Alumno restaurado correctamente',
            icon: 'success',
            timer: 2000, // 3 segundos
            timerProgressBar: true,
          });

          // Vuelve a cargar la lista de alumnos reciclados después de restaurar
          this.getAlumnosReciclaje();
        },
        (error) => {
          console.error('Error al restaurar alumno', error);

          // Mostrar mensaje de error con SweetAlert2 y cerrar después de 3 segundos
          Swal.fire({
            title: 'Error',
            text: 'Error al restaurar el alumno',
            icon: 'error',
            timer: 1000, // 3 segundos
            timerProgressBar: true,
          });
        }
      );
    } else {
      console.error('ID de alumno no válido');
    }
  }
}
