import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PartnerMainPageComponent} from "./partner-app/layout/partner-main-page/partner-main-page.component";
import {CompanyInformationComponent} from "./partner-app/layout/company-information/company-information.component";
import {ChatsComponent} from "./partner-app/layout/chats/chats.component";
import {CarWashRegistrationComponent} from "./partner-app/layout/car-wash-registration/car-wash-registration.component";

const routes: Routes = [
  {path: 'partner-main', component: PartnerMainPageComponent},
  {path: 'comp-inf', component: CompanyInformationComponent},
  {path: 'chats', component: ChatsComponent},
  {path: 'car-wash-reg', component: CarWashRegistrationComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
