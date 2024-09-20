import { Component } from '@angular/core';
import {PartnerHeaderComponent} from "../../components/partner-header/partner-header.component";
import {PartnerFooterComponent} from "../../components/partner-footer/partner-footer.component";
import {WashService} from "../../../models/wash-service";
import {NgForOf, NgIf} from "@angular/common";
import {Box} from "../../../models/wash-box";
import {InvitationDTO, InvitationModalComponent} from "../../modals/invitation-modal/invitation-modal.component";
import {MatDialog} from "@angular/material/dialog";
import {AddServiceModalComponent} from "../../modals/add-service-modal/add-service-modal.component";
import {AddBoxModalComponent} from "../../modals/add-box-modal/add-box-modal.component";
import {HttpClient} from "@angular/common/http";
import {Configuration} from "../../../models/wash-config";
import {forkJoin, switchMap} from "rxjs";
import {FormsModule} from "@angular/forms";

export interface ExtendedWashService extends WashService {
  isEditing: boolean;
}

export interface dataForBoxModal {
  box: Box | null,
  carWashId: number | null;
}

export interface dataForServiceModal {
  service: WashService | null;
  carWashId: number | null;
}

@Component({
  selector: 'app-services-and-boxes',
  standalone: true,
  imports: [
    PartnerHeaderComponent,
    PartnerFooterComponent,
    NgForOf,
    NgIf,
    FormsModule
  ],
  templateUrl: './services-and-boxes.component.html',
  styleUrl: './services-and-boxes.component.css'
})
export class ServicesAndBoxesComponent {

  activeTab: string = 'tab1';
  services: ExtendedWashService[] = [];
  boxes: Box[] = [];
  carWashId!: number;

  constructor(public dialog: MatDialog, private http: HttpClient) {
    this.http.get<Configuration>("api/car-wash/configuration").pipe(
      switchMap((configuration: Configuration) => {
        this.carWashId = configuration.id;
        // Выполняем второй и третий запросы параллельно с использованием forkJoin
        return forkJoin({
          services: this.http.get<WashService[]>("api/service/" + this.carWashId),
          boxes: this.http.get<Box[]>("api/car-wash/box/" + this.carWashId)
        });
      })
    ).subscribe(
      ({ services, boxes }) => {
        this.services = services.map(service => ({
          ...service,
          isEditing: false
        }));
        this.boxes = boxes;
        console.log('Services:', this.services);
        console.log('Boxes:', this.boxes);
      },
      error => {
        console.error('Ошибка при получении данных автомойки', error);
        // Дополнительные действия при ошибке получении данных
      }
    );
  }

  startEditing(service: ExtendedWashService) {
    service.isEditing = true;
  }

  deleteService(id: number) {
    this.http.delete("api/service/" + id).subscribe();
    window.location.reload();
  }

  deleteBox(boxId: number) {
    this.http.delete("api/car-wash/box/" + boxId).subscribe();
    window.location.reload();
  }

  saveService(service: ExtendedWashService) {
    this.http.put(`/api/service/${service.id}`, service).subscribe(
      response => {
        service.isEditing = false;
        // Обработка ответа если необходимо
      },
      error => {
        console.error('Ошибка при сохранении услуги', error);
      }
    );
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  get servicesCount(): number {
    return this.services.length;
  }

  get boxesCount(): number {
    return this.boxes.length;
  }

  openDialogService(data: dataForServiceModal): void {
    const dialogRef = this.dialog.open(AddServiceModalComponent, {
      panelClass: 'invitation-modal',
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        window.location.reload();
      }
    });
  }

  openDialogBox(data: dataForBoxModal): void {
    const dialogRef = this.dialog.open(AddBoxModalComponent, {
      panelClass: 'invitation-modal',
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      window.location.reload();
    });
  }

  onEditBox(box: Box): void {
    const data: dataForBoxModal = {
      box: box,
      carWashId: null
    }

    this.openDialogBox(data);
  }

  onEditService(service: WashService) {
    const data: dataForServiceModal = {
      service: service,
      carWashId: null
    }

    this.openDialogService(data);
  }

  onAddButtonClick() {
    if (this.activeTab === 'tab1') {
      const data: dataForServiceModal = {
        service: null,
        carWashId: this.carWashId
      }
      this.openDialogService(data);
    } else if (this.activeTab === 'tab2') {
      const data: dataForBoxModal = {
        box: null,
        carWashId: this.carWashId
      }
      this.openDialogBox(data);
    }
  }
}
