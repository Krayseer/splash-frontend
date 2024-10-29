import { Routes } from '@angular/router';
import {HeaderComponent} from "./components/header/header.component";
import {FooterComponent} from "./components/footer/footer.component";
import {RegistrationComponent} from "./layout/registration/registration.component";
import {MainPageComponent} from "./layout/main-page/main-page.component";
import {OrderRegistrationComponent} from "./layout/order-registration/order-registration.component";
import {AuthorizationComponent} from "./layout/authorization/authorization.component";
import {CarWashRegistrationComponent} from "./layout/car-wash-registration/car-wash-registration.component";
import {PartnerHeaderComponent} from "./partner-app/components/partner-header/partner-header.component";
import {PartnerSettingsComponent} from "./partner-app/components/partner-settings/partner-settings.component";
import {
  NotificationSettingsComponent
} from "./partner-app/layout/notification-settings/notification-settings.component";
import {SwitchComponent} from "./partner-app/components/switch/switch.component";
import {CompanyInformationComponent} from "./partner-app/layout/company-information/company-information.component";
import {EmployeesComponent} from "./partner-app/layout/employees/employees.component";
import {OrdersScheduleComponent} from "./partner-app/layout/orders-schedule/orders-schedule.component";
import {ServicesAndBoxesComponent} from "./partner-app/layout/services-and-boxes/services-and-boxes.component";
import {MapComponent} from "./map/map.component";
import {UserProfileComponent} from "./layout/user-profile/user-profile.component";
import {PartnerMainPageComponent} from "./partner-app/layout/partner-main-page/partner-main-page.component";

export const routes: Routes = [
  {path: '', redirectTo: 'main', pathMatch: 'full'},
  {path: 'header', component: HeaderComponent},
  {path: 'footer', component: FooterComponent},
  {path: 'registration', component: RegistrationComponent},
  {path: 'main', component: MainPageComponent},
  {path: 'order', component: OrderRegistrationComponent},
  {path: 'auth', component: AuthorizationComponent},
  {path: 'car-wash-reg', component: CarWashRegistrationComponent},
  {path: 'partner-header', component: PartnerHeaderComponent},
  {path: 'partner-settings', component: PartnerSettingsComponent},
  {path: 'notification-settings', component: NotificationSettingsComponent},
  {path: 'switch', component: SwitchComponent},
  {path: 'comp-information', component: CompanyInformationComponent},
  {path: 'employees', component: EmployeesComponent},
  {path: 'orders-schedule', component: OrdersScheduleComponent},
  {path: 'services-and-boxes', component: ServicesAndBoxesComponent},
  {path: 'map', component: MapComponent},
  {path: 'user-profile', component: UserProfileComponent},
  {path: 'partner-main', component: PartnerMainPageComponent}
];
