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

  ngOnInit() {
    
  }

 
}
