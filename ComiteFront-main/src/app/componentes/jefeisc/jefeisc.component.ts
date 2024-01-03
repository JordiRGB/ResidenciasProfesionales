import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-jefeisc',
  templateUrl: './jefeisc.component.html',
  styleUrls: ['./jefeisc.component.css']
})
export class JefeiscComponent implements OnInit {
  Alumno: any[] = []; // Ajusta el tipo de datos según la estructura de tus alumnos

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.getAlumnos(); // Llama a la función para obtener los alumnos al inicializar el componente
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
}
