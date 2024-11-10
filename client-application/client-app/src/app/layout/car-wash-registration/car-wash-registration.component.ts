import { Component } from '@angular/core';
import {FormsModule, NgForm} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {NgClass, NgIf} from "@angular/common";
import {Router, RouterLink} from "@angular/router";

export interface ConfigurationRegisterRequest {
  tin: string;
  typeOrganization: string; // Assuming TypeOrganization is a string, otherwise import and use the correct type
  email: string;
}

@Component({
  selector: 'app-car-wash-registration',
  templateUrl: './car-wash-registration.component.html',
  styleUrl: './car-wash-registration.component.css'
})
export class CarWashRegistrationComponent {

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit(form: NgForm) {
    if (form.valid) {
      const registrationData: ConfigurationRegisterRequest = {
        tin: form.value.tin,
        typeOrganization: form.value.typeOrganization,
        email: form.value.email
      };

      this.http.post(`api/car-wash/configuration`, registrationData).subscribe(
        response => {
          this.router.navigate(['/comp-information']);
          console.log('Registration successful:', response);
        },
        error => {
          console.error('Registration error:', error);
        }
      );
    }
  }

}
