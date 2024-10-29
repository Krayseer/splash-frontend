// import {APP_INITIALIZER, ApplicationConfig, importProvidersFrom, Provider} from '@angular/core';
// import { provideRouter } from '@angular/router';
//
// import { routes } from './app.routes';
// import {HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient, withInterceptorsFromDi} from "@angular/common/http";
// import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
// import {AngularYandexMapsModule, YaConfig} from "angular8-yandex-maps";
// import {KeycloakBearerInterceptor, KeycloakService} from "keycloak-angular";
//
//
//
// const mapConfig: YaConfig = {
//   apikey: '3e8e4a0c-1e23-442b-90f9-98cc4c51987d',
//   lang: 'en_US',
// };
//
// function initializeKeycloak(keycloak: KeycloakService) {
//   return () =>
//     keycloak.init({
//       config: {
//         url: 'http://localhost:80', // проверьте, что это правильный URL
//         realm: 'splash',
//         clientId: 'splash-client'
//       },
//       initOptions: {
//         onLoad: 'check-sso',
//         silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html'
//       },
//       enableBearerInterceptor: true,
//       bearerPrefix: 'Bearer'
//     }).catch((error) => {
//       console.error('Keycloak initialization failed:', error);
//     });
// }
//
// // Provider for Keycloak Bearer Interceptor
// const KeycloakBearerInterceptorProvider: Provider = {
//   provide: HTTP_INTERCEPTORS,
//   useClass: KeycloakBearerInterceptor,
//   multi: true
// };
//
// // Provider for Keycloak Initialization
// const KeycloakInitializerProvider: Provider = {
//   provide: APP_INITIALIZER,
//   useFactory: initializeKeycloak,
//   multi: true,
//   deps: [KeycloakService]
// }
//
// // Exported configuration for the application
// export const appConfig: ApplicationConfig = {
//   providers: [
//     provideHttpClient(withInterceptorsFromDi()), // Provides HttpClient with interceptors
//     KeycloakInitializerProvider, // Initializes Keycloak
//     KeycloakBearerInterceptorProvider, // Provides Keycloak Bearer Interceptor
//     KeycloakService, // Service for Keycloak
//     provideRouter(routes),
//     //importProvidersFrom(HttpClientModule)// Provides routing for the application
//   ]
// };
//
//
// // export const appConfig: ApplicationConfig = {
// //   providers: [provideRouter(routes), importProvidersFrom(HttpClientModule), provideAnimationsAsync(), importProvidersFrom(AngularYandexMapsModule.forRoot(mapConfig))]
// // };
