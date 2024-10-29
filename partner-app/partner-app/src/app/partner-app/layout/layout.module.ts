import {NgModule} from "@angular/core";
import {CompanyInformationComponent} from "./company-information/company-information.component";
import {EmployeesComponent} from "./employees/employees.component";
import {NotificationSettingsComponent} from "./notification-settings/notification-settings.component";
import {OrdersScheduleComponent} from "./orders-schedule/orders-schedule.component";
import {PartnerMainPageComponent} from "./partner-main-page/partner-main-page.component";
import {ServicesAndBoxesComponent} from "./services-and-boxes/services-and-boxes.component";
import {ComponentsModule} from "../components/components.module";
import {NgxMaskDirective} from "ngx-mask";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatFormField, MatFormFieldModule, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatInput, MatInputModule} from "@angular/material/input";
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerModule,
  MatDatepickerToggle
} from "@angular/material/datepicker";
import {NgxMaterialTimepickerModule} from "ngx-material-timepicker";
import {MatButton} from "@angular/material/button";
import {CommonModule, NgFor, NgForOf, NgIf} from "@angular/common";
import {MatNativeDateModule} from "@angular/material/core";
import {NgSelectModule} from "@ng-select/ng-select";
import {RouterLink} from "@angular/router";
import { ChatsComponent } from './chats/chats.component';

@NgModule({
  declarations: [CompanyInformationComponent, EmployeesComponent, NotificationSettingsComponent, OrdersScheduleComponent,
  PartnerMainPageComponent, ServicesAndBoxesComponent, ChatsComponent],
  imports: [ComponentsModule, NgxMaskDirective, FormsModule, MatFormField, MatInput, MatDatepickerInput,
  MatDatepickerToggle, MatSuffix, MatDatepicker, NgxMaterialTimepickerModule, MatButton, NgForOf, NgIf, MatLabel,
  ReactiveFormsModule, CommonModule, MatFormFieldModule, MatDatepickerModule, MatInputModule, MatNativeDateModule,
  NgSelectModule, RouterLink],
  exports: [CompanyInformationComponent, EmployeesComponent, NotificationSettingsComponent, OrdersScheduleComponent,
    PartnerMainPageComponent, ServicesAndBoxesComponent, ChatsComponent]
})
export class LayoutModule {}
