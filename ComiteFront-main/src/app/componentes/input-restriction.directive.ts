import { Directive, HostListener, Input  } from '@angular/core';

@Directive({
  selector: '[appInputRestriction]'
})
export class InputRestrictionDirective {
  @Input('inputRestriction') inputRestriction: string;

  constructor() { }
  @HostListener('input', ['$event']) onInputChange(event: any) {
    const initialValue = this.inputRestriction ? this.inputRestriction.replace(/[0-9]/g, '') : '';
    event.target.value = event.target.value.replace(new RegExp(initialValue, 'g'), '');
  }
}
