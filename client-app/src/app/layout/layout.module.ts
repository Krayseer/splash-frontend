import {NgModule} from "@angular/core";
import {AuthorizationComponent} from "./authorization/authorization.component";
import {CarWashRegistrationComponent} from "./car-wash-registration/car-wash-registration.component";
import {MainPageComponent} from "./main-page/main-page.component";
import {OrderRegistrationComponent} from "./order-registration/order-registration.component";
import {RegistrationComponent} from "./registration/registration.component";
import {UserProfileComponent} from "./user-profile/user-profile.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule, NgClass, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {HeaderComponent} from "../components/header/header.component";
import {FooterComponent} from "../components/footer/footer.component";
import {ComponentsModule} from "../components/components.module";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatInputModule} from "@angular/material/input";
import {MatNativeDateModule} from "@angular/material/core";
import {NgSelectModule} from "@ng-select/ng-select";

@NgModule({
  declarations: [AuthorizationComponent, CarWashRegistrationComponent, MainPageComponent, OrderRegistrationComponent,
  RegistrationComponent, UserProfileComponent],
  imports: [FormsModule, ReactiveFormsModule, CommonModule, NgClass, NgIf, RouterLink, ComponentsModule,
  MatFormFieldModule, MatDatepickerModule, MatInputModule, MatNativeDateModule, NgSelectModule],
  exports: [AuthorizationComponent, CarWashRegistrationComponent, MainPageComponent, OrderRegistrationComponent,
    RegistrationComponent, UserProfileComponent]
})
export class LayoutModule {}
