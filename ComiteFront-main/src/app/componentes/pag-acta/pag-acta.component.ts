import { Component, OnInit, HostListener } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-pag-acta',
  templateUrl: './pag-acta.component.html',
  styleUrls: ['./pag-acta.component.css']
})
export class PagActaComponent implements OnInit {
  currentDateAndTime: { date: string; time: string };
  tipoSesion: string = '';
  public palabras: string='';
  public romano: string ='';


  constructor(private router: Router, private dataService: DataService) {
    this.currentDateAndTime = this.getCurrentDateTimeFormatted();
  }
  ngOnInit(): void {
    this.obtenerInformacionActa();
  }

  obtenerInformacionActa(){
    this.dataService.obtenerInformacionActa().subscribe(
      data => {
        this.palabras = data.words;
        this.romano = data.roman;
      },
      error => {
        console.error('Error al obtener la información del acta:', error);
      }
    );
  }

  getCurrentDateTimeFormatted(): { date: string; time: string } {
    const optionsDate: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    };
  
    const optionsTime: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: 'numeric'
    };
    const date = new Date();
    const formattedDate = date.toLocaleDateString('es-MX', optionsDate);
    const formattedTime = date.toLocaleTimeString('es-MX', optionsTime);
  
    return { date: formattedDate, time: formattedTime };
  }

  getCurrentDate(): Date {
    return new Date();
  }

  asistentes = [
    { nombre: 'M. en C. Roberto Leguízamo Jiménez', cargo: 'Director Académico', cargoSec:'Presidente del Comité Académico', presente: false },
    { nombre: 'C.D. Vicente Fernando Carbajal Gutiérrez', cargo: 'Subdirector de Servicios Escolares', presente: false },
    { nombre: 'Ing. Máximo Livera Leónides', cargo: 'Jefe de División de Ingeniería Electromecánica', presente: false },
    { nombre: 'Lic. Marino Zúñiga Domínguez', cargo: 'Jefe de División de Ingeniería Informática', presente: false },
    { nombre: 'M. en T.I. Blanca Inés Valencia Vázquez', cargo: 'Jefa de División de Ingeniería en Sistemas Computacionales', presente: false },
    { nombre: 'Lic. Verónica Sánchez Lara', cargo: 'Jefa de Departamento de Control Escolar', presente: false },
    { nombre: 'Ing. Rene Rivera Roldan', cargo: ' Jefe de División de Ingeniería Electrónica', presente: false },
    { nombre: 'M.R.I. Vianca Lisseth Pérez Cruz', cargo: 'Jefa de División de Ingeniería Industrial', cargoSec: 'Secretaria de Comité Académico', presente: false },
  ];

  Pdatos(): void {
    const asistentesSeleccionados = this.asistentes.filter((asistente) => asistente.presente);
    this.dataService.setAsistentesSeleccionados(asistentesSeleccionados);
    this.dataService.setTipoSesion(this.tipoSesion);
    this.router.navigate(['/pagActaTwo']);
  }
}
