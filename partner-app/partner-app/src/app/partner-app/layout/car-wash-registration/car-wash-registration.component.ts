import { Component } from '@angular/core';
import {FormsModule, NgForm} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {NgClass, NgIf} from "@angular/common";
import {Router, RouterLink} from "@angular/router";
import {KeycloakService} from "keycloak-angular";

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
  selector: 'app-car-wash-registration',
  templateUrl: './car-wash-registration.component.html',
  styleUrl: './car-wash-registration.component.css'
})
export class CarWashRegistrationComponent {

  constructor(private http: HttpClient, private router: Router, private keycloakService: KeycloakService) {}

  onSubmit(form: NgForm) {
    if (form.valid) {
      const organizationInfo: OrganizationInfo = {
        tin: form.value.tin,
        typeOrganization: form.value.typeOrganization,
        email: form.value.email
      };

      const configurationDTO: ConfigurationDTO = {
        userId: '8d1192c2-7afe-4ffe-a294-5281978cb886',
        organizationInfo: organizationInfo
      }

      this.http.post(`backend/car-wash/configuration`, configurationDTO).subscribe(
        response => {
          this.router.navigate(['/comp-inf']);
          console.log('Registration successful:', response);
        },
        error => {
          console.error('Registration error:', error);
        }
      );
    }
  }

}
