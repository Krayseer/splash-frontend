import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import {KeycloakAngularModule, KeycloakService} from "keycloak-angular";
import {APP_INITIALIZER} from "@angular/core";
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {platformBrowserDynamic} from "@angular/platform-browser-dynamic";
import {AppModule} from "./app/app.module";

platformBrowserDynamic().bootstrapModule(AppModule).catch(err => console.error(err))
