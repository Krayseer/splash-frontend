import {Component, Inject} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {WashService} from "../../../models/wash-service";
import {HttpClient} from "@angular/common/http";
import {dataForServiceModal, ExtendedWashService} from "../../layout/services-and-boxes/services-and-boxes.component";
import {MatFormField} from "@angular/material/form-field";
import {NgxMaterialTimepickerModule} from "ngx-material-timepicker";
import {MatIcon} from "@angular/material/icon";

export interface ServiceRequest {
  name: string | null | undefined;
  duration: number | null | undefined;
  price: number | null | undefined;
}

@Component({
  selector: 'app-add-service-modal',
  templateUrl: './add-service-modal.component.html',
  styleUrl: './add-service-modal.component.css'
})
export class AddServiceModalComponent {

  service: WashService | null = null;
  name!: string;
  time!: number;
  price!: number;

  constructor(private dialogRef: MatDialogRef<AddServiceModalComponent>, @Inject(MAT_DIALOG_DATA) public data: dataForServiceModal,
              private http: HttpClient) {
    if (data && data.service) {
      this.service = data.service;
      this.name = data.service.name;
      this.time = data.service.duration / 60000;
      this.price = data.service.price;
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  submit(): void {
    const serviceRequest: ServiceRequest = {
      name: this.name,
      duration: this.time * 60000,
      price: this.price
    };
    if (this.service != null) {
      // Редактирование существующей услуги
      this.http.put(`/api/service/${this.service.id}`, serviceRequest).subscribe(
        response => this.dialogRef.close(true),
        error => console.error('Ошибка при сохранении услуги', error)
      );
    } else {
      //TODO: Убрать хардкод
      this.http.post<WashService>('/api/service/' + this.data.carWashId, serviceRequest).subscribe(
        response => this.dialogRef.close(true),
        error => console.error('Ошибка при добавлении услуги', error)
      );
    }
  }

  addColon(event: any) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/[^0-9:]/g, '').substring(0, 9);
    let numbers = value.match(/\d{1,3}/g) || [];
    let formattedValue = numbers.join(':');

    // Оставляем только первые два числа для минут, два для секунд и три для миллисекунд
    formattedValue = formattedValue.substring(0, 2) + ':' + formattedValue.substring(2, 4) + ':' + formattedValue.substring(4, 7);

    input.value = formattedValue.substring(0, 9);
  }

  convertTimeStringToMilliseconds(timeString: string): number {
    const timeParts = timeString.split(':');

    if (timeParts.length !== 3) {
      throw new Error('Invalid time format. Expected format: MM:SS:MS');
    }

    const minutes = parseInt(timeParts[0], 10);
    const seconds = parseInt(timeParts[1], 10);
    const milliseconds = parseInt(timeParts[2], 10);

    if (isNaN(minutes) || isNaN(seconds) || isNaN(milliseconds)) {
      throw new Error('Invalid time format. Non-numeric values found.');
    }

    return (minutes * 60 * 1000) + (seconds * 1000) + milliseconds;
  }

}
