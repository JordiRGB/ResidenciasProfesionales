import { Component } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-pag-acta-two',
  templateUrl: './pag-acta-two.component.html',
  styleUrls: ['./pag-acta-two.component.css']
})
export class PagActaTwoComponent {
  textoRecuperado: string = '';

  constructor(private dataService: DataService) {
    this.textoRecuperado = this.dataService.getTextoGuardado();
  }
}
