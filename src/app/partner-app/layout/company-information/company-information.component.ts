import {AfterViewInit, Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {PartnerHeaderComponent} from "../../components/partner-header/partner-header.component";
import {PartnerSettingsComponent} from "../../components/partner-settings/partner-settings.component";
import {IConfig, NgxMaskDirective, provideEnvironmentNgxMask, provideNgxMask} from "ngx-mask";
import {bootstrapApplication} from "@angular/platform-browser";
import {AppComponent} from "../../../app.component";
import {FormBuilder, FormGroup, FormsModule, Validators} from "@angular/forms";
import {MatFormField, MatSuffix} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {NgxMaterialTimepickerModule} from "ngx-material-timepicker";
import {MatButton} from "@angular/material/button";
import {PartnerFooterComponent} from "../../components/partner-footer/partner-footer.component";
import {HttpClient} from "@angular/common/http";
import {Configuration} from "../../../models/wash-config";
import {NgForOf, NgIf} from "@angular/common";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";

declare const ymaps: any;

const maskConfig: Partial<IConfig> = {
  validation: false,
};

bootstrapApplication(AppComponent, {
  providers: [provideEnvironmentNgxMask(maskConfig)]
}).catch((err) => console.error(err));

export interface ConfigurationUpdateRequest {
  name: string;
  description: string;
  phoneNumber: string;
  address: string;
  longitude: string;
  latitude: string;
  openTime: string;
  closeTime: string;
  photos: File[] | (string | ArrayBuffer | null)[];
  managementProcessOrders: boolean;
}

@Component({
  selector: 'app-company-information',
  templateUrl: './company-information.component.html',
  styleUrl: './company-information.component.css',
  standalone: true,
  imports: [
    PartnerHeaderComponent,
    PartnerSettingsComponent,
    NgxMaskDirective,
    FormsModule,
    MatFormField,
    MatInput,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatSuffix,
    MatDatepicker,
    NgxMaterialTimepickerModule,
    MatButton,
    PartnerFooterComponent,
    NgForOf,
    NgIf
  ],
  providers: [provideNgxMask()]
})
export class CompanyInformationComponent implements OnInit, AfterViewInit {

  @ViewChild('mapContainer', {static: false}) mapContainer!: ElementRef;
  map: any;
  marker: any;

  name: string = '';
  description: string = '';
  phoneNumber: string = '';
  address: string = '';
  openTime: string = '';
  closeTime: string = '';
  longitude: string = '';
  latitude: string = '';
  managementProcessOrders: boolean = false;
  photos: string[] = []; // Массив URL существующих фотографий
  selectedFiles: File[] = [];
  data: any;

  constructor(private http: HttpClient, private fb: FormBuilder, private router: Router,
              private snackBar: MatSnackBar, private zone: NgZone) {
  }

  ngAfterViewInit(): void {
    ymaps.ready().then(() => {
      this.map = new ymaps.Map(this.mapContainer.nativeElement, {
        center: [55.76, 37.64],
        zoom: 7
      });

      this.map.events.add('click', (e: any) => {
        const coords = e.get('coords');
        this.longitude = coords[1].toFixed(6);
        this.latitude = coords[0].toFixed(6);

        // Удаление предыдущей метки, если она есть
        if (this.marker) {
          this.map.geoObjects.remove(this.marker);
        }

        // Добавление новой метки на карту
        this.marker = new ymaps.Placemark(coords, {}, {
          preset: 'islands#icon',
          iconColor: '#0095b6'
        });
        this.map.geoObjects.add(this.marker);

        // Получение адреса по координатам
        ymaps.geocode(coords).then((res: any) => {
          this.zone.run(() => {
            this.address = res.geoObjects.get(0).getAddressLine();
          });
        });
      });
    });

    this.getConfigs();
    }

  getConfigs() {
    this.http.get<Configuration>("api/car-wash/configuration").subscribe(
      (data: Configuration) => {
        this.name = data.name;
        this.description = data.description;
        this.phoneNumber = data.phoneNumber;
        this.address = data.address;
        this.openTime = data.openTime;
        this.closeTime = data.closeTime;
        this.longitude = data.longitude;
        this.latitude = data.latitude;
        this.managementProcessOrders = data.managementProcessOrders;
        this.photos = data.photoUrls;
        console.log(data);
        if (this.longitude && this.latitude) {
          const coordinates = [parseFloat(this.latitude), parseFloat(this.longitude)];

          if (this.marker) {
            this.marker.geometry.setCoordinates(coordinates);
          } else {
            this.marker = new ymaps.Placemark(coordinates, {}, {
              preset: 'islands#icon',
              iconColor: '#0095b6'
            });
            this.map.geoObjects.add(this.marker);
          }

          // Центрируем карту на координатах
          this.map.setCenter(coordinates, 7);
        }
      }, error => {
        if (error.error && error.error.errorData.includes("Configuration for user")) {
          this.snackBar.open('Необходимо зарегистрировать автомойку', 'Закрыть', {
            duration: 3000,
          });
          this.router.navigate(['car-wash-reg']);
        }
        console.log('Ошибка в конфигурации', error);
      }
    );
  }

  ngOnInit(): void {}

  onTimeStartChange(time: string) {
    this.openTime = time;
  }

  onTimeEndChange(time: string) {
    this.closeTime = time;
  }

  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files && files.length) {
      for (let i = 0; i < files.length; i++) {
        this.selectedFiles.push(files[i]);
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.photos.push(e.target.result);
        };
        reader.readAsDataURL(files[i]);
      }
    }
  }

  triggerFileInput(): void {
    document.getElementById('fileInput')!.click();
  }


  onSave() {
    const formData = new FormData();
    formData.append('name', this.name);
    formData.append('description', this.description);
    formData.append('phoneNumber', this.phoneNumber);
    formData.append('address', this.address);
    formData.append('openTime', this.openTime);
    formData.append('closeTime', this.closeTime);
    formData.append('longitude', this.longitude.toString());
    formData.append('latitude', this.latitude.toString());
    formData.append('managementProcessOrders', JSON.stringify(this.managementProcessOrders));
    if (this.selectedFiles && this.selectedFiles.length > 0) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        formData.append('photos', this.selectedFiles[i]);
      }
      // for (let i = 0; i < this.photos.length; i++) {
      //   const base64Data = this.photos[i].split(',')[1]; // Извлекаем base64 строку
      //   const byteCharacters = atob(base64Data);
      //   const byteNumbers = new Array(byteCharacters.length);
      //   for (let j = 0; j < byteCharacters.length; j++) {
      //     byteNumbers[j] = byteCharacters.charCodeAt(j);
      //   }
      //   const byteArray = new Uint8Array(byteNumbers);
      //   const blob = new Blob([byteArray], { type: 'image/jpeg' }); // Тип MIME изображения, может быть изменен
      //
      //   formData.append('photos', blob, `photo${i}.jpg`);
      // }
    }

    this.http.put("api/car-wash/configuration", formData).subscribe(
      response => {
        console.log('Данные сохранены успешно', response);
      },
      error => {
        console.error('Ошибка при сохранении данных', error);
      }
    );
  }
}
