import {NgModule} from "@angular/core";
import {AddBoxModalComponent} from "./add-box-modal/add-box-modal.component";
import {AddServiceModalComponent} from "./add-service-modal/add-service-modal.component";
import {InvitationModalComponent} from "./invitation-modal/invitation-modal.component";
import {OrderModalComponent} from "./order-modal/order-modal.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DirectivesModule} from "../../directives/directives.module";
import {MatFormField} from "@angular/material/form-field";
import {NgxMaterialTimepickerModule} from "ngx-material-timepicker";
import {MatIcon} from "@angular/material/icon";
import {MatDialogActions, MatDialogContent, MatDialogTitle} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import {NgForOf} from "@angular/common";


@NgModule({
  declarations: [AddBoxModalComponent, AddServiceModalComponent, InvitationModalComponent, OrderModalComponent],
  imports: [FormsModule, ReactiveFormsModule, DirectivesModule, MatFormField,  NgxMaterialTimepickerModule,
  MatIcon, MatDialogContent, MatDialogActions, MatButton, MatDialogTitle, NgForOf],
  exports: [AddBoxModalComponent, AddServiceModalComponent, InvitationModalComponent, OrderModalComponent]
})
export class ModalsModule{}
