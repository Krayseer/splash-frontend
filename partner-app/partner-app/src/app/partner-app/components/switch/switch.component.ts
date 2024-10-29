import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-switch',
  templateUrl: './switch.component.html',
  styleUrl: './switch.component.css'
})
export class SwitchComponent {

  @Input() labelText!: string;
  @Input() isChecked: boolean = false;
  @Output() switchChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() {
  }

  onSwitchChange(event: any): void {
    this.switchChanged.emit(this.isChecked);
  }

}
