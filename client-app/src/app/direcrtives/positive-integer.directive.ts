import {Directive, HostListener, Input} from '@angular/core';
import {NgControl} from "@angular/forms";

@Directive({
  selector: '[appPositiveInteger]',
  standalone: true
})
export class PositiveIntegerDirective {

  constructor(private ngControl: NgControl) {}

  @HostListener('input', ['$event']) onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    // Удаляет все символы, кроме цифр
    value = value.replace(/[^0-9]/g, '');

    // Обновляет значение в контроле
    this.ngControl.control?.setValue(value);
  }
}
