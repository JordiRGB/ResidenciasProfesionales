import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-jefeisc',
  templateUrl: './jefeisc.component.html',
  styleUrls: ['./jefeisc.component.css']
})
export class JefeiscComponent implements OnInit {
  Alumno: any[] = [];

  constructor(private authService: AuthService, private toastr: ToastrService) { }

  ngOnInit() {
    this.getAlumnos();
  }

  getAlumnos() {
    this.authService.getAlumnos().subscribe(
      (data: any) => {
        console.log('Datos de alumnos:', data);
        this.Alumno = data;
      },
      (error) => {
        console.error('Error obteniendo alumnos', error);
      }
    );
  }

  moverAlumnoAlReciclaje(alumnoId: string): void {
    this.authService.moverAlumno(alumnoId).subscribe(
      (data) => {
        // Mostrar mensaje de éxito con Toastr
        this.toastr.success('Alumno movido al reciclaje', 'Éxito', { timeOut: 3000 });
  
        // Recargar la página después de mostrar el mensaje
        window.location.reload();
      },
      (error) => {
        console.error('Error moviendo alumno al reciclaje:', error);
  
        // Verifica el tipo de error
        if (error instanceof HttpErrorResponse) {
          console.error('Estado del error:', error.status);
          console.error('Mensaje del error:', error.error);
        }
  
        // Mostrar mensaje de error con Toastr
        this.toastr.error('Error al mover el alumno al reciclaje', 'Error');
      }
    );
  }
  
  
}
