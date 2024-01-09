import { Component, OnInit, HostListener } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-pag-acta',
  templateUrl: './pag-acta.component.html',
  styleUrls: ['./pag-acta.component.css']
})
export class PagActaComponent implements OnInit {
  tipoSesion: string = '';
  wordsRepresentation: string = '';
  currentDate: string = '';
  count = 67;
  asistentes = [
    { nombre: 'M. en C. Roberto Leguízamo Jiménez', cargo: 'Director Académico y Presidente del Comité Académico', presente: false },
    { nombre: 'C.D. Vicente Fernando Carbajal Gutiérrez', cargo: 'Subdirector de Servicios Escolares', presente: false },
    { nombre: 'Ing. Máximo Livera Leónides', cargo: 'Jefe de División de Ingeniería Electromecánica', presente: false },
    { nombre: 'Lic. Marino Zúñiga Domínguez', cargo: 'Jefe de División de Ingeniería Informática', presente: false },
    { nombre: 'M. en T.I. Blanca Inés Valencia Vázquez', cargo: 'Jefa de División de Ingeniería en Sistemas Computacionales', presente: false },
    { nombre: 'Lic. Verónica Sánchez Lara', cargo: 'Jefa de Departamento de Control Escolar', presente: false },
    { nombre: 'Ing. Rene Rivera Roldan', cargo: ' Jefe de División de Ingeniería Electrónica', presente: false },
    { nombre: 'M.R.I. Vianca Lisseth Pérez Cruz', cargo: 'Jefa de División de Ingeniería Industrial y Secretaria de Comité Académico', presente: false },
  ];

  ngOnInit(): void {
    this.updateEditableText();
  }

  updateEditableText(): void {
    const editableText = document.getElementById('editableText');
    if (editableText) {
      this.wordsRepresentation = this.convertToWords(this.count);
      editableText.textContent = this.convertToWords(this.count) + ' SESION ';
    }
  }
  getCurrentDate(): Date {
    return new Date();
  }


  convertToWords(number: number): string {
    if (number < 1 || number > 100) {
      return 'Número fuera del rango admitido';
    }

    const units = ['', 'PRIMERA', 'SEGUNDA', 'TERCERA', 'CUARTA', 'QUINTA', 'SEXTA', 'SEPTIMA', 'OCTAVA', 'NOVENA'];
    const tens = ['', 'DECIMA', 'VIGESIMA', 'TRIGESIMA', 'CUADRAGESIMA', 'QUINCUAGESIMA', 'SEXAGESIMA', 'SEPTUAGESIMA', 'OCTOGESIMA', 'NONAGESIMA'];

    if (number < 10) {
      return units[number];
    } else if (number % 10 === 0) {
      return tens[Math.floor(number / 10)];
    } else {
      return tens[Math.floor(number / 10)] + ' ' + units[number % 10];
    }
  }
  getRomanNumber(): number {
    if (this.wordsRepresentation === this.wordsRepresentation) {
      return this.count;
    } else {
      return 0;
    }
  }

  convertToRoman(num: number): string {
    const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX', 'XXI', 'XXII', 'XXIII', 'XXIV', 'XXV', 'XXVI', 'XXVII', 'XXVIII', 'XXIX', 'XXX', 'XXXI', 'XXXII', 'XXXIII', 'XXXIV', 'XXXV', 'XXXVI', 'XXXVII', 'XXXVIII', 'XXXIX', 'XL', 'XLI', 'XLII', 'XLIII', 'XLIV', 'XLV', 'XLVI', 'XLVII', 'XLVIII', 'XLIX', 'L', 'LI', 'LII', 'LIII', 'LIV', 'LV', 'LVI', 'LVII', 'LVIII', 'LIX', 'LX', 'LXI', 'LXII', 'LXIII', 'LXIV', 'LXV', 'LXVI', 'LXVII', 'LXVIII', 'LXIX', 'LXX', 'LXXI', 'LXXII', 'LXXIII', 'LXXIV', 'LXXV', 'LXXVI', 'LXXVII', 'LXXVIII', 'LXXIX', 'LXXX', 'LXXXI', 'LXXXII', 'LXXXIII', 'LXXXIV', 'LXXXV', 'LXXXVI', 'LXXXVII', 'LXXXVIII', 'LXXXIX', 'XC', 'XCI', 'XCII', 'XCIII', 'XCIV', 'XCV', 'XCVI', 'XCVII', 'XCVIII', 'XCIX', 'C'];

    if (num < 1 || num > 100) {
      return 'Número fuera del rango admitido'+ this.wordsRepresentation;
    }

    return romanNumerals[num - 1];
  }

  constructor(private router: Router, private dataService: DataService) {
    this.currentDate = this.getCurrentDateFormatted();
  }

  getCurrentDateFormatted(): string {
    const options: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    };

    const date = new Date();
    return date.toLocaleString('es-MX', options);
  }
  guardarTexto() {
    const editableSection = document.getElementById('editableSection');
    
    if (editableSection && this.tipoSesion) {
      this.dataService.setTipoSesion(this.tipoSesion);
      let textoCompleto = editableSection.textContent || editableSection.innerText;
      textoCompleto = textoCompleto.replace(/ORDINARIA/g, '');
      textoCompleto = textoCompleto.replace(/EXTRA/g, this.tipoSesion);
      if (textoCompleto && textoCompleto.trim() !== '') {
        this.dataService.setTextoGuardado(textoCompleto);
        console.log('Texto completo:', textoCompleto);
        this.router.navigate(['pagActaTwo']);
      } else {
        console.error('El elemento editable está vacío. No se guardará ningún texto.');
      }
    } else {
      console.error('No se ha encontrado el elemento editable o no se ha seleccionado un tipo de sesión.');
    }
  }
  
  
  
  

  @HostListener('document:click')
  onDocumentClick(): void {
    this.count++;
    this.updateEditableText();
  }


}
