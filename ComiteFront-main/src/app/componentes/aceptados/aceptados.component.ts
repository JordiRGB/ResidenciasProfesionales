import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-aceptados',
  templateUrl: './aceptados.component.html',
  styleUrls: ['./aceptados.component.css']
})
export class AceptadosComponent implements OnInit {
  aceptadosAlumnos: any[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.cargarAceptadosAlumnos();
  }

  cargarAceptadosAlumnos(): void {
    this.authService.getAceptadosAlumnos().subscribe(
      (data) => {
        this.aceptadosAlumnos = data;
      },
      (error) => {
        console.error('Error al cargar los alumnos aceptados', error);
      }
    );
  }

  
}
