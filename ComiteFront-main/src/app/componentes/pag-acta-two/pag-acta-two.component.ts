import { Component } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-pag-acta-two',
  templateUrl: './pag-acta-two.component.html',
  styleUrls: ['./pag-acta-two.component.css']
})
export class PagActaTwoComponent {
  currentDateAndTime: { date: string; time: string };
  public palabras: string='';
  public romano: string ='';
  public tipoSesion: string = '';
  asistentesSeleccionados: any[] = [];
  constructor(private dataService: DataService) {
    this.currentDateAndTime = this.getCurrentDateTimeFormatted();
  }

  ngOnInit(): void {
    this.obtenerInformacionActa();
    this.tipoSesion = this.dataService.getTipoSesion();
    this.asistentesSeleccionados = this.dataService.getAsistentesSeleccionados(); 
  }
  getFormattedAsistentes(): string {
    return this.asistentesSeleccionados
      .map((asistente) => `${asistente.nombre} ${asistente.cargo}`)
      .join('; ');
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
}
