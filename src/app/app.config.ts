import {ApplicationConfig, importProvidersFrom} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {HttpClientModule} from "@angular/common/http";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {AngularYandexMapsModule, YaConfig} from "angular8-yandex-maps";

const mapConfig: YaConfig = {
  apikey: '3e8e4a0c-1e23-442b-90f9-98cc4c51987d',
  lang: 'en_US',
};

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), importProvidersFrom(HttpClientModule), provideAnimationsAsync(), importProvidersFrom(AngularYandexMapsModule.forRoot(mapConfig))]
};
