import { Component } from '@angular/core';
import {PartnerHeaderComponent} from "../../components/partner-header/partner-header.component";
import {PartnerSettingsComponent} from "../../components/partner-settings/partner-settings.component";
import {PartnerFooterComponent} from "../../components/partner-footer/partner-footer.component";
import {SwitchComponent} from "../../components/switch/switch.component";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-notification-settings',
  standalone: true,
  imports: [
    PartnerHeaderComponent,
    PartnerSettingsComponent,
    PartnerFooterComponent,
    SwitchComponent,
    FormsModule
  ],
  templateUrl: './notification-settings.component.html',
  styleUrl: './notification-settings.component.css'
})
export class NotificationSettingsComponent {

  statusEmail: boolean = true;
  statusSms: boolean = true;
  statusPush: boolean = false;

  checkEmail: boolean = false;
  checkSms: boolean = false;
  checkPush: boolean = false;

  constructor() {
  }

  statusEmailChanged(switchValue: boolean): void {
    this.statusEmail = switchValue;
  }

  statusSmsChanged(switchValue: boolean): void {
    this.statusSms = switchValue;
  }

  statusPushChanged(switchValue: boolean): void {
    this.statusPush = switchValue;
  }

  checkEmailChanged(switchValue: boolean): void {
    this.checkEmail = switchValue;
  }

  checkSmsChanged(switchValue: boolean): void {
    this.checkSms = switchValue;
  }

  checkPushChanged(switchValue: boolean): void {
    this.checkPush = switchValue;
  }

}
