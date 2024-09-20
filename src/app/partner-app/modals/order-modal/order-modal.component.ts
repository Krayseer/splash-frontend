import {Component, Inject} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {AddServiceModalComponent} from "../add-service-modal/add-service-modal.component";
import {HttpClient} from "@angular/common/http";
import {dataForBoxModal} from "../../layout/services-and-boxes/services-and-boxes.component";
import {OrderDialogData} from "../../layout/orders-schedule/orders-schedule.component";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-order-modal',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgForOf
  ],
  templateUrl: './order-modal.component.html',
  styleUrl: './order-modal.component.css'
})
export class OrderModalComponent {

  currentData: OrderDialogData;

  constructor(public dialogRef: MatDialogRef<AddServiceModalComponent>, private http: HttpClient,
              @Inject(MAT_DIALOG_DATA) public data: OrderDialogData) {
    this.currentData = data;
    console.log(this.currentData);
  }

  close(): void {
    this.dialogRef.close();
  }

  getTotalPrice(): number {
    if (!this.currentData || !this.currentData.services) {
      return 0; // Возвращаем 0, если данных нет или они пусты
    }

    // Инициализируем переменную для хранения общей стоимости
    let totalPrice = 0;

    // Проходимся по массиву услуг и суммируем их цены
    for (const service of this.currentData.services) {
      totalPrice += service.price || 0; // Добавляем цену услуги к общей стоимости
    }

    return totalPrice;
  }

  getTotalTime(): number {
    if (!this.currentData || !this.currentData.services) {
      return 0; // Возвращаем 0, если данных нет или они пусты
    }

    // Инициализируем переменную для хранения общего времени выполнения
    let totalDuration = 0;

    // Проходимся по массиву услуг и суммируем их длительность
    for (const service of this.currentData.services) {
      if (service.duration !== undefined) {
        totalDuration += service.duration; // Добавляем длительность услуги к общему времени
      }
    }

    return totalDuration;
  }

}
