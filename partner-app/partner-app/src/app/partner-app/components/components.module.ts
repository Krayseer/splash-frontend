import {NgModule} from "@angular/core";
import {PartnerHeaderComponent} from "./partner-header/partner-header.component";
import {PartnerFooterComponent} from "./partner-footer/partner-footer.component";
import {PartnerSettingsComponent} from "./partner-settings/partner-settings.component";
import {SwitchComponent} from "./switch/switch.component";
import {NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {RouterLink} from "@angular/router";
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [PartnerHeaderComponent, PartnerFooterComponent, PartnerSettingsComponent, SwitchComponent],
  imports: [NgOptimizedImage, NgIf, NgForOf, RouterLink, FormsModule],
  exports: [PartnerHeaderComponent, PartnerFooterComponent, PartnerSettingsComponent, SwitchComponent]
})
export class ComponentsModule {}
