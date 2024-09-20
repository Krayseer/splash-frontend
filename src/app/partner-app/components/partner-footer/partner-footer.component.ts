import { Component } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-partner-footer',
  standalone: true,
  imports: [],
  templateUrl: './partner-footer.component.html',
  styleUrl: './partner-footer.component.css'
})
export class PartnerFooterComponent {
  constructor(private router: Router) {
  }

  goToComp() {
    this.router.navigate(['/comp-information']);
  }

  goToMain() {
    this.router.navigate(['/main']);
  }
}
