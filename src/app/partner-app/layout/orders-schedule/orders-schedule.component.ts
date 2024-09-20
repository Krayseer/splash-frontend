import {Component, ViewChild} from '@angular/core';
import {CommonModule, NgForOf} from "@angular/common";
import {PartnerHeaderComponent} from "../../components/partner-header/partner-header.component";
import {PartnerFooterComponent} from "../../components/partner-footer/partner-footer.component";
import {HttpClient, HttpParams} from "@angular/common/http";
import {switchMap} from "rxjs";
import {Configuration} from "../../../models/wash-config";
import {InvitationDTO, InvitationModalComponent} from "../../modals/invitation-modal/invitation-modal.component";
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerModule,
  MatDatepickerToggle
} from "@angular/material/datepicker";
import {MatFormField, MatFormFieldModule, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatInput, MatInputModule} from "@angular/material/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TimeRangeDTO} from "../../../layout/order-registration/order-registration.component";
import {MatNativeDateModule} from "@angular/material/core";
import {NgSelectModule} from "@ng-select/ng-select";
import {formatDate} from "date-fns";
import {User} from "../../../models/user";
import {UserDTO} from "../employees/employees.component";
import {WashService} from "../../../models/wash-service";
import {MatDialog} from "@angular/material/dialog";
import {OrderModalComponent} from "../../modals/order-modal/order-modal.component";

interface Booking {
  boxId: number;
  startTime: string;
  endTime: string;
}

interface Box {
  id: number;
  name: string;
}

export interface OrderDTO {
  id: number;
  user: UserDTO;
  carWashId: number;
  boxId: number;
  status: string;
  services: WashService[];
  startTime: string;
  endTime: string;
  typePayment: string;
  createdAt: string;
}

export interface OrderDialogData {
  user: UserDTO;
  services: WashService[];
}

@Component({
  selector: 'app-orders-schedule',
  standalone: true,
  imports: [
    NgForOf,
    PartnerHeaderComponent,
    PartnerFooterComponent,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatFormField,
    MatInput,
    MatLabel,
    MatSuffix,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    FormsModule,
    MatNativeDateModule,
    NgSelectModule
  ],
  templateUrl: './orders-schedule.component.html',
  styleUrl: './orders-schedule.component.css'
})
export class OrdersScheduleComponent {

  bookings: Booking[] = [
    { boxId: 1, startTime: '10:00', endTime: '12:00' },
    { boxId: 2, startTime: '15:00', endTime: '18:00' }
  ];

  carWashId!: number;
  configuration!: Configuration;
  orders: OrderDTO[] = [];
  selectedDate: Date | null;
  minDate: Date;

  constructor(private http: HttpClient, public dialog: MatDialog) {
    this.selectedDate = null;
    this.minDate = new Date();
    this.http.get<Configuration>("api/car-wash/configuration").subscribe(
      data => {
        this.configuration = data;
        this.carWashId = data.id;
      }
    );
  }

  openOrderDialog(order: OrderDTO) {
    const data: OrderDialogData = {
      user: order.user,
      services: order.services
    }
    const dialogRef = this.dialog.open(OrderModalComponent, {
      panelClass: 'invitation-modal',
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Модальное окно закрыто');
      // Логика после закрытия модального окна, если необходимо
    });
  }

  getBoxNameFromId() {

  }

  dateChanges() {
    if (this.selectedDate) {
      // Форматирование даты в формат 'dd-MM-yyyy'
      const formattedDate = formatDate(this.selectedDate, 'dd-MM-yyyy');

      const params = new HttpParams()
        .set('carWashId', this.carWashId)
        .set('date', formattedDate);

      // Отправка запроса с форматированной датой
      this.http.get<OrderDTO[]>('api/order/car-wash/by-date', { params })
        .subscribe(response => {
          this.orders = response;
          console.log(this.orders);// Обработка ответа
        }, error => {
          console.error(error); // Обработка ошибки
        });
    }
  }

  isBooked(box: Box, time: string): boolean {
    return this.bookings.some(booking => {
      return booking.boxId === box.id && time >= booking.startTime && time < booking.endTime;
    });
  }

  getDate(order: OrderDTO): string {
    const datePart = order.createdAt.split('T')[0];
    return datePart;
  }

  getTime(order: OrderDTO): string {
    const timePart = order.createdAt.split('T')[1].split('.')[0];
    return timePart;
  }

  getTimeFromISOString(isoString: string): string {
    const date = new Date(isoString);

    // Получаем часы и минуты
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();

    // Форматируем часы и минуты в строку HH:mm
    const formattedTime = `${this.padZero(hours)}:${this.padZero(minutes)}`;

    return formattedTime;
  }

  /**
   * Добавляет ведущий ноль к числу, если оно меньше 10
   * @param num Число
   * @returns Число в строковом формате с ведущим нулем
   */
  private padZero(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }

  getDateFromISOString(isoString: string): string {
    const date = new Date(isoString);

    // Получаем день, месяц и год
    const day = date.getUTCDate();
    const month = date.getUTCMonth(); // Номера месяцев начинаются с 0 (январь = 0, декабрь = 11)
    const year = date.getUTCFullYear();

    // Преобразуем номер месяца в название месяца на русском языке
    const monthName = this.getMonthName(month);

    // Форматируем дату в строку "дд месяц гггг"
    const formattedDate = `${day} ${monthName} ${year}`;

    return formattedDate;
  }

  /**
   * Преобразует номер месяца в название месяца на русском языке
   * @param month Номер месяца (0-11)
   * @returns Название месяца на русском языке
   */
  private getMonthName(month: number): string {
    const monthNames = [
      'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
      'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
    ];
    return monthNames[month];
  }

  getPrice(services: WashService[]): number {
    let result = 0;
    for (const service of services) {
      result += service.price;
    }
    return result;
  }

}
