import { Component } from '@angular/core';

@Component({
  selector: 'app-pag-inicio',
  templateUrl: './pag-inicio.component.html',
  styleUrls: ['./pag-inicio.component.css']
})
export class PagInicioComponent {
  ngAfterViewInit(): void {
    this.myFunction();
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
}
