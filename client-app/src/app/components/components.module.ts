import {NgModule} from "@angular/core";
import {FooterComponent} from "./footer/footer.component";
import {HeaderComponent} from "./header/header.component";
import {SettingsComponent} from "./settings/settings.component";
import {NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {RouterLink} from "@angular/router";
import {HttpClient} from "@angular/common/http";

@NgModule({
  declarations: [FooterComponent, HeaderComponent, SettingsComponent],
  imports: [NgOptimizedImage, NgIf, NgForOf, RouterLink],
  exports: [FooterComponent, HeaderComponent, SettingsComponent]
})
export class ComponentsModule {}
