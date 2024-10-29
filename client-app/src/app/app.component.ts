import {Component, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {KeycloakService} from "keycloak-angular";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ui-sources';
}
