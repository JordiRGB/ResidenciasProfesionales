import { Component, OnInit} from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-papelera',
  templateUrl: './papelera.component.html',
  styleUrls: ['./papelera.component.css']
})
export class PapeleraComponent implements OnInit {
  alumnosReciclaje: any[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.getAlumnosReciclaje();
  }

  getAlumnosReciclaje(): void {
    this.authService.getAlumnosReciclaje().subscribe(
      (data) => {
        console.log('Alumnos en reciclaje:', data);
        this.alumnosReciclaje = data;
      },
      (error) => {
        console.error('Error obteniendo alumnos en reciclaje', error);
      }
    );
  }
}
