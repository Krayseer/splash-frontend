import { Component } from '@angular/core';
import {MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import {FormsModule} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {Configuration} from "../../../models/wash-config";

export interface InvitationDTO {
  username: string;
  carWashId: number;
  roles: string[];
}

@Component({
  selector: 'app-invitation-modal',
  standalone: true,
  imports: [
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatDialogTitle,
    FormsModule
  ],
  templateUrl: './invitation-modal.component.html',
  styleUrl: './invitation-modal.component.css'
})
export class InvitationModalComponent {

  username: string = '';
  roles: string[] = [];
  carWashId!: number;

  constructor(public dialogRef: MatDialogRef<InvitationModalComponent>, private http: HttpClient) {
    this.http.get<Configuration>("api/car-wash/configuration").subscribe(
      data => {
        this.carWashId = data.id;
      }
    );
  }

  onRoleSelect(event: any) {
    const selectedRole = event.target.value;
    this.roles.push(selectedRole);
  }

  close(): void {
    this.dialogRef.close();
  }

  submit(): void {
    const invite: InvitationDTO = {
      username: this.username,
      roles: this.roles,
      carWashId: this.carWashId
    }
    this.http.post("api/car-wash/invitation", invite).subscribe(
      response => {
        console.log('Данные сохранены успешно', response);
      },
      error => {
        console.error('Ошибка при сохранении данных', error);
      }
    );
    this.dialogRef.close();
  }
}
