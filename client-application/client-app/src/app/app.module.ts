// src/app/app.module.ts
import {APP_INITIALIZER, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import {AppRoutingModule} from "./app-routing.module";
import {ComponentsModule} from "./components/components.module";
import {LayoutModule} from "./layout/layout.module";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {KeycloakAngularModule, KeycloakService} from "keycloak-angular";
import {AppInterceptorInterceptor} from "./app-interceptor";
import {AngularYandexMapsModule, YaConfig} from "angular8-yandex-maps";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {RouterModule} from "@angular/router"; // основной компонент

const mapConfig: YaConfig = {
  apikey: '3e8e4a0c-1e23-442b-90f9-98cc4c51987d',
  lang: 'en_US',
};

function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        url: 'http://localhost:80',
        realm: 'splash',
        clientId: 'splash-client'
      },
      initOptions: {
        onLoad: "login-required",
        flow: "standard",
        checkLoginIframe: false
      },
      enableBearerInterceptor: true,
      bearerPrefix: 'Bearer',
      bearerExcludedUrls: [
        '/assets',
        '/clients/public']
    }).then(authenticated => {
      console.log("Authenticated: ", authenticated);
    }).catch(error => {
      console.error("Keycloak init failed", error);
    });
}

@NgModule({
  declarations: [AppComponent], // Добавляем основной компонент
  imports: [BrowserModule,
    AppRoutingModule,
    ComponentsModule,
    LayoutModule,
    HttpClientModule,
    KeycloakAngularModule,
    AngularYandexMapsModule.forRoot(mapConfig),
    RouterModule,
    BrowserAnimationsModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AppInterceptorInterceptor,
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService],
    }
  ],
  bootstrap: [AppComponent] // Указываем, что `AppComponent` будет загружаться первым
})
export class AppModule {}
