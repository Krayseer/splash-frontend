import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AngularYandexMapsModule} from "angular8-yandex-maps";

declare const ymaps: any;

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [
    AngularYandexMapsModule
  ],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements AfterViewInit {

  @ViewChild('mapContainer', {static: false}) mapContainer!: ElementRef;
  map: any;

  placemarks: number[][] = [
    [55.76, 37.64], // Координаты первой точки
    [55.751244, 37.618423], // Координаты второй точки
    // Добавьте больше точек по необходимости
  ];

  constructor() {}

  ngAfterViewInit(): void {
    ymaps.ready().then(() => {
      this.map = new ymaps.Map(this.mapContainer.nativeElement, {
        center: [55.76, 37.64],
        zoom: 7
      });

      this.addPlacemarks();
    });
  }

  addPlacemarks(): void {
    for (let coords of this.placemarks) {
      const placemark = new ymaps.Placemark(coords, {
        balloonContent: 'Точка на карте'
      }, {
        preset: 'islands#icon',
        iconColor: '#0095b6'
      });
      this.map.geoObjects.add(placemark);
    }
  }
}
