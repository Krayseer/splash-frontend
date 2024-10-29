import { Component } from '@angular/core';
import {PartnerHeaderComponent} from "../../components/partner-header/partner-header.component";
import {PartnerSettingsComponent} from "../../components/partner-settings/partner-settings.component";
import {PartnerFooterComponent} from "../../components/partner-footer/partner-footer.component";
import {NgForOf, NgIf} from "@angular/common";
import {MatDialog} from "@angular/material/dialog";
import {InvitationDTO, InvitationModalComponent} from "../../modals/invitation-modal/invitation-modal.component";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Configuration} from "../../../models/wash-config";
import {forkJoin, switchMap} from "rxjs";
import {User} from "../../../models/user";

interface Employee {
  name: string;
  status: string;
  roles: string[];
  email: string;
}

export interface UserSettingDTO {
  pushEnabled: boolean;
  emailEnabled: boolean;
}

export interface UserDTO {
  id: number;
  name: string;
  surname: string;
  username: string;
  email: string;
  phoneNumber: string;
  createdAt: string;
  roles: string[];
  userSetting: UserSettingDTO;
  photoUrl: string;
}

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.css'
})
export class EmployeesComponent {

  activeTab: string = 'tab1';
  employees: UserDTO[] = [];
  carWashId!: number;
  invitations: InvitationDTO[] = [];

  constructor(public dialog: MatDialog, private http: HttpClient) {
    this.http.get<Configuration>("api/car-wash/configuration").pipe(
      switchMap((configuration: Configuration) => {
        this.carWashId = configuration.id;
        const params = new HttpParams().set('carWashId', this.carWashId);
        // Выполнить второй запрос, используя ID автомойки
        return forkJoin({
          invitations: this.http.get<InvitationDTO[]>("api/car-wash/invitation/" + this.carWashId),
          employees: this.http.get<UserDTO[]>("api/car-wash/employee", {params})
        });
      })
    ).subscribe(
      ({ invitations, employees }) => {
        this.invitations = invitations;
        this.employees = employees;
        console.log('Invitations:', this.invitations);
        console.log('Workers:', this.employees);
      },
      error => {
        console.error('Ошибка при получении приглашений', error);
      }
    );
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(InvitationModalComponent, {
      panelClass: 'invitation-modal'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Модальное окно закрыто');
      // Логика после закрытия модального окна, если необходимо
    });
  }
}
