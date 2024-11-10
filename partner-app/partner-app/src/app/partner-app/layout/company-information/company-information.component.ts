import {AfterViewInit, Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {IConfig, provideNgxMask} from "ngx-mask";
import {FormBuilder} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {
  Address,
  ConfigurationDTO,
  ConfigurationInfoDTO,
  OrderProcessMode,
  OrganizationInfo
} from "../car-wash-registration/car-wash-registration.component";

declare const ymaps: any;

const maskConfig: Partial<IConfig> = {
  validation: false,
};

// bootstrapApplication(AppComponent, {
//   providers: [provideEnvironmentNgxMask(maskConfig)]
// }).catch((err) => console.error(err));

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
    this.http.get<ConfigurationInfoDTO>("backend/car-wash/configuration").subscribe(
      (data: ConfigurationInfoDTO) => {
        this.name = data.organizationInfo?.name || '';
        this.description = data.organizationInfo?.description || '';
        this.phoneNumber = data.organizationInfo?.phoneNumber || '';
        this.address = data.address?.address || '';
        this.openTime = data.openTime || '';
        this.closeTime = data.closeTime || '';
        this.longitude = data.address?.longitude || '';
        this.latitude = data.address?.latitude || '';
        this.photos = data.photoUrls || [];
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
        if (error.error && error.error.message.includes("Configuration for user")) {
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

  onVideoSelected(event: any): void {

  }

  triggerFileInput(): void {
    document.getElementById('fileInput')!.click();
  }

  triggerFileInputVideo(): void {
    document.getElementById('videoInput')!.click();
}


  onSave() {
    const organizationInfo: OrganizationInfo = {
      name: this.name,
      description: this.description,
      phoneNumber: this.phoneNumber
    }

    const address: Address = {
      address: this.address,
      longitude: this.longitude.toString(),
      latitude: this.latitude.toString()
    }
    const configurationDTO: ConfigurationDTO = {
      id: 2,
      userId: '8d1192c2-7afe-4ffe-a294-5281978cb886',
      organizationInfo: organizationInfo,
      address: address,
      openTime: this.openTime,
      closeTime: this.closeTime,
      orderProcessMode: OrderProcessMode.AUTO,
      photos: this.selectedFiles
    }
    const formData = new FormData();
    formData.append('organizationInfo', JSON.stringify(organizationInfo));
    formData.append('address', JSON.stringify(address));
    formData.append('openTime', this.openTime);
    formData.append('closeTime', this.closeTime);
    formData.append('orderProcessMode', JSON.stringify(OrderProcessMode.AUTO));
    if (this.selectedFiles && this.selectedFiles.length > 0) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        formData.append('photos', this.selectedFiles[i]);
      }
    }

    this.http.put("backend/car-wash/configuration", formData).subscribe(
      response => {
        console.log('Данные сохранены успешно', response);
      },
      error => {
        console.error('Ошибка при сохранении данных', error);
      }
    );
  }
}
