import { AfterViewInit, Component, ViewChild, ElementRef } from '@angular/core';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-pag-inicio',
  templateUrl: './pag-inicio.component.html',
  styleUrls: ['./pag-inicio.component.css']
})
export class PagInicioComponent implements AfterViewInit {
  @ViewChild('carousel') carouselElement: ElementRef | undefined;

  ngAfterViewInit(): void {
    this.myFunction(); // La función original que proporcionaste
    this.initializeCarousel();
  }

  myFunction(): void {
    const x = document.getElementById('myTopnav');
    if (x) {
      if (x.className === 'topnav') {
        x.className += ' responsive';
      } else {
        x.className = 'topnav';
      }
    }
  }

  initializeCarousel(): void {
    if (this.carouselElement) {
      const myCarousel = new bootstrap.Carousel(this.carouselElement.nativeElement, {
        interval: 3000 // Cambia la imagen cada 3 segundos (ajusta según tus necesidades)
      });
    }
  }
}
