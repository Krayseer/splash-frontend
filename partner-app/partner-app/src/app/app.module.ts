import {APP_INITIALIZER, NgModule} from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {ComponentsModule} from "./partner-app/components/components.module";
import {LayoutModule} from "./partner-app/layout/layout.module";
import {DirectivesModule} from "./directives/directives.module";
import {ModalsModule} from "./partner-app/modals/modals.module";
import {HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient, withFetch} from "@angular/common/http";
import {KeycloakAngularModule, KeycloakService} from "keycloak-angular";
import {AppInterceptorInterceptor} from "./app-interceptor";


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
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ComponentsModule,
    LayoutModule,
    DirectivesModule,
    ModalsModule,
    HttpClientModule,
    KeycloakAngularModule
  ],
  providers: [
    provideHttpClient(withFetch())
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: AppInterceptorInterceptor,
    //   multi: true,
    // },
    // {
    //   provide: APP_INITIALIZER,
    //   useFactory: initializeKeycloak,
    //   multi: true,
    //   deps: [KeycloakService],
    // }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
