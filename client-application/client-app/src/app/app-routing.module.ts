import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HeaderComponent} from "./components/header/header.component";
import {AuthorizationComponent} from "./layout/authorization/authorization.component";
import {MainPageComponent} from "./layout/main-page/main-page.component";
import {UserProfileComponent} from "./layout/user-profile/user-profile.component";
import {OrderRegistrationComponent} from "./layout/order-registration/order-registration.component";

const routes: Routes = [
  { path: 'main', component: MainPageComponent },
  { path: 'user-profile', component: UserProfileComponent },
  { path: 'auth', component: AuthorizationComponent },
  { path: 'order', component: OrderRegistrationComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
