import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, NgModule, ViewChild} from '@angular/core';
import {HeaderComponent} from "../../components/header/header.component";
import {FooterComponent} from "../../components/footer/footer.component";
import {HttpClient, HttpClientModule, HttpParams} from "@angular/common/http";
import {CommonModule} from "@angular/common";
import {SendOrder} from "../../models/send-order";
import {Configuration} from "../../models/wash-config";
import {MatFormField, MatFormFieldModule, MatLabel} from "@angular/material/form-field";
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerModule,
  MatDatepickerToggle
} from "@angular/material/datepicker";
import {FormsModule} from "@angular/forms";
import {MatInput, MatInputModule} from "@angular/material/input";
import {MatNativeDateModule} from "@angular/material/core";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {format} from "date-fns";
import {NgSelectModule} from "@ng-select/ng-select";
import {Router} from "@angular/router";

declare const ymaps: any;

export interface TimeRangeDTO {
  startTime: string;
  endTime: string;
}

export interface ConfigurationDTO {
  id?: number; // Long in Java corresponds to number in TypeScript
  userId?: string; // UUID in Java can be represented as a string in TypeScript
  organizationInfo?: OrganizationInfo; // Assuming OrganizationInfo is another interface
  address?: Address; // Assuming Address is another interface
  serviceIds?: number[]; // List<Long> in Java corresponds to number[] in TypeScript
  boxes?: BoxDTO[]; // Assuming BoxDTO is another interface
  photoUrls?: string[]; // List<String> in Java corresponds to string[] in TypeScript
  photos?: File[]; // List<MultipartFile> in Java corresponds to File[] in TypeScript
  openTime?: string; // Instant in Java can be represented as a string (ISO format)
  closeTime?: string; // Instant in Java can be represented as a string (ISO format)
  orderProcessMode?: OrderProcessMode; // Assuming OrderProcessMode is another interface
  video?: File; // MultipartFile in Java corresponds to File in TypeScript
  videoId?: string; // videoId as string
}

export interface ConfigurationInfoDTO {
  id?: number; // Long в Java соответствует number в TypeScript
  userId?: string; // UUID в Java можно представить как string в TypeScript
  organizationInfo?: OrganizationInfo; // Предполагается, что OrganizationInfo — это другой интерфейс
  address?: Address; // Предполагается, что Address — это другой интерфейс
  services?: ServiceDTO[]; // Предполагается, что ServiceDTO — это другой интерфейс
  boxes?: BoxDTO[]; // Предполагается, что BoxDTO — это другой интерфейс
  photoUrls?: string[]; // List<String> в Java соответствует string[] в TypeScript
  openTime?: string; // Instant в Java можно представить как string (ISO формат)
  closeTime?: string; // Instant в Java можно представить как string (ISO формат)
  orderProcessMode?: OrderProcessMode; // Использование перечисления OrderProcessMode
  videoId?: string; // videoId как строка
}

export interface ServiceDTO {
  id: number;
  name: string;
  duration: number;
  price: number;
}

export interface Address {
  longitude?: string;
  latitude?: string;
  address?: string;
}

export interface BoxDTO {
  id: number;
  name: string;
  carWashId: number;
}

export enum OrderProcessMode {
  AUTO = 'AUTO',
  SELF_SERVICE = 'SELF_SERVICE',
  MANAGER_PROCESSING = 'MANAGER_PROCESSING'
}

export interface OrganizationInfo {
  tin?: string;
  typeOrganization?: string; // Assuming TypeOrganization is a string, otherwise import and use the correct type
  email?: string;
  name?: string;
  description?: string;
  phoneNumber?: string;
}

@Component({
  selector: 'app-order-registration',
  templateUrl: './order-registration.component.html',
  styleUrl: './order-registration.component.css'
})

export class OrderRegistrationComponent implements AfterViewInit{

  @ViewChild('mapContainer', {static: false}) mapContainer!: ElementRef;
  map: any;

  carWashes: ConfigurationInfoDTO[] = [];
  selectedCarWashId: number = -1;
  selectedServicesIndices: number[] = [];
  selectedConfiguration: ConfigurationInfoDTO | undefined;
  selectedDate: Date | null;
  minDate: Date;
  freeIntervals: TimeRangeDTO[] = [];
  selectedTime: string | null = null;

  isVisibleFirst: boolean = true;
  isVisibleSecond: boolean = false;
  isVisibleThird: boolean = false;

  userCoord: any;
  timeSlots: string[] = [];

  currentIndex: number = 0;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef, private router: Router) {
    this.minDate = new Date();
    this.minDate.setDate(this.minDate.getDate() + 1);
    this.selectedDate = null;
  }

  ngAfterViewInit(): void {
    ymaps.ready().then(() => {
      this.map = new ymaps.Map(this.mapContainer.nativeElement, {
        center: [55.76, 37.64],
        zoom: 7
      });
      this.getLocation();
    });
    this.getConfigs();
    }

  selectCarWash(id: number) {
    this.selectedCarWashId = id;
    this.selectedConfiguration = this.getConfigurationById(id);
    this.cdr.detectChanges();
  }

  getConfigurationById(id: number): ConfigurationInfoDTO | undefined {
    return this.carWashes.find(configuration => configuration.id === id);
  }

  goToSecondStep() {
    this.isVisibleFirst = false;
    this.isVisibleSecond = true;
    this.isVisibleThird = false;
  }

  goToThirdStep() {
    this.isVisibleFirst = false;
    this.isVisibleSecond = false;
    this.isVisibleThird = true;
  }

  formatDate(date: Date): string {
    return format(date, 'dd-MM-yyyy');
  }

  dateChanges() {
    if (this.selectedConfiguration == undefined) {
      return;
    }
    if (this.selectedDate) {
      const formattedDate = this.formatDate(this.selectedDate);
      const params = new HttpParams()
        .set('id', this.selectedConfiguration.id ?? 2)
        .set('date', formattedDate);
      this.http.get<TimeRangeDTO[]>("api/order/car-wash/free-times", {params}).subscribe(
        response => {
          this.freeIntervals = response;
          this.timeSlots = this.getIntervalsForAllRanges(response);
          console.log('Свободные отрезки', this.getFiveMinuteIntervals(this.freeIntervals[0]));
        }
      );
    }
  }

  getFiveMinuteIntervals(timeRange: TimeRangeDTO): string[] {
    const startTime = new Date(timeRange.startTime);
    const endTime = new Date(timeRange.endTime);

    const intervals: string[] = [];

    let currentTime = new Date(startTime);

    while (currentTime <= endTime) {
      intervals.push(currentTime.toISOString().substring(11, 16));
      currentTime.setMinutes(currentTime.getMinutes() + 5);
    }

    return intervals;
  }

  getIntervalsForAllRanges(timeRanges: TimeRangeDTO[]): string[] {
    const allIntervals: string[] = [];

    for (const range of timeRanges) {
      const intervals = this.getFiveMinuteIntervals(range);
      allIntervals.push(...intervals);
    }

    return this.sortTimes(allIntervals);
  }

  sortTimes(timeStrings: string[]) {
    return timeStrings.sort((a, b) => {
      const [aHours, aMinutes] = a.split(':').map(Number);
      const [bHours, bMinutes] = b.split(':').map(Number);
      return aHours - bHours || aMinutes - bMinutes;
    });
  }

  isSelected(index: number) {
    return this.selectedServicesIndices.includes(index);
  }

  toggleServiceSelection(index: number) {
    const isSelected = this.selectedServicesIndices.includes(index);
    if (isSelected) {
      // Если сервис уже выбран, удалить его из массива выбранных сервисов
      this.selectedServicesIndices = this.selectedServicesIndices.filter(i => i !== index);
      if (this.selectedServicesIndices.length === 0) {
        this.selectedDate = null;
        this.selectedTime = null;
      }
    } else {
      // Если сервис не выбран, добавить его в массив выбранных сервисов
      this.selectedServicesIndices.push(index);
    }
  }

  getTotalPrice(): number {
    return this.selectedServicesIndices.reduce((total, index) => {
      // @ts-ignore
      return total + this.selectedConfiguration.services[index].price;
    }, 0);
  }

  getTotalTime(): number {
    return this.selectedServicesIndices.reduce((total, index) => {
      // @ts-ignore
      return total + this.selectedConfiguration.services[index].duration / 60000;
    }, 0);
  }

  getConfigs() {
    this.http.get<ConfigurationInfoDTO[]>("backend/car-wash/configuration/all").subscribe(
      (data) => {
        this.carWashes = data;
        this.addMarkers();
        console.log(this.carWashes);
      }
    );
  }

  sendOrder() {
    if (this.selectedDate && this.selectedTime && this.selectedConfiguration) {
      const [hours, minutes] = this.selectedTime.split(':').map(Number);

      // Устанавливаем часы и минуты в selectedDate
      const orderDate = new Date(this.selectedDate);
      orderDate.setHours(hours);
      orderDate.setMinutes(minutes);
      orderDate.setSeconds(0);
      orderDate.setMilliseconds(0);

      // @ts-ignore
      const selectedServices = this.selectedServicesIndices.map(index => this.selectedConfiguration.services[index].id);

      // Преобразуем дату в строку формата ISO с учетом локального времени
      const orderDateString = new Date(orderDate.getTime() - orderDate.getTimezoneOffset() * 60000).toISOString().slice(0, 19) + "Z";
      console.log(orderDateString);
      let order: SendOrder = new SendOrder(this.selectedCarWashId, selectedServices, orderDateString, "SBP");
      this.http.post("api/order/user", order).subscribe(
        data => {
          this.router.navigate(['/main'])
        }
      );
    }
  }

  getCurrentPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      } else {
        reject(new Error('Geolocation is not supported by this browser.'));
      }
    });
  }

  getLocation(): void {
    this.getCurrentPosition()
      .then(position => {
        const coords = position.coords;
        console.log(`Latitude: ${coords.latitude}, Longitude: ${coords.longitude}`);
        this.userCoord = coords;
        this.addUserMarker(coords.latitude, coords.longitude);
      })
      .catch(error => {
        console.error('Error getting location', error);
        this.userCoord = null;
        this.centerMapOnYekaterinburg();
      });
  }

  centerMapOnYekaterinburg(): void {
    const yekaterinburgCoords = [56.8389261, 60.6057025]; // Координаты Екатеринбурга
    this.map.setCenter(yekaterinburgCoords, 12); // Центрируем карту на Екатеринбурге с зумом 12
  }

  addUserMarker(lat: number, lon: number): void {
    const userPlacemark = new ymaps.Placemark([lat, lon], {
      balloonContent: 'Это вы здесь',
      iconCaption: 'Вы здесь'
    }, {
      preset: 'islands#redDotIconWithCaption',
      iconColor: 'red'
    });

    this.map.geoObjects.add(userPlacemark);
    this.map.setCenter([lat, lon], 12); // Центрируем карту на местоположении пользователя с зумом 12
  }

  // @ts-ignore
  get currentImage(): string {
    if (this.selectedConfiguration) {
      return this.selectedConfiguration.photoUrls && this.selectedConfiguration.photoUrls.length > 0
        ? this.selectedConfiguration.photoUrls[this.currentIndex]
        : 'assets/images/recomendation.png';
    }
  }

  nextImage() {
    if (this.selectedConfiguration && this.selectedConfiguration.photoUrls && this.selectedConfiguration.photoUrls.length > 0) {
      this.currentIndex = (this.currentIndex + 1) % this.selectedConfiguration.photoUrls.length;
    }
  }

  prevImage() {
    if (this.selectedConfiguration && this.selectedConfiguration.photoUrls && this.selectedConfiguration.photoUrls.length > 0) {
      this.currentIndex = (this.currentIndex - 1 + this.selectedConfiguration.photoUrls.length) % this.selectedConfiguration.photoUrls.length;
    }
  }

  addMarkers() {
    if (this.map) {
      this.carWashes.forEach(carWash => {
        if (carWash.address?.latitude !== null && carWash.address?.longitude !== null) {
          const marker = new ymaps.Placemark([carWash.address?.latitude, carWash.address?.longitude], {
            balloonContent: carWash.organizationInfo?.name
          });
          marker.events.add('click', () => {
            this.selectCarWash(carWash.id ?? 2);
          });
          this.map.geoObjects.add(marker);
        }
      });
    }
  }
}
