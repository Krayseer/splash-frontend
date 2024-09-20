import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {AddServiceModalComponent} from "../add-service-modal/add-service-modal.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {PositiveIntegerDirective} from "../../../direcrtives/positive-integer.directive";
import {Box} from "../../../models/wash-box";
import {HttpClient} from "@angular/common/http";
import {dataForBoxModal} from "../../layout/services-and-boxes/services-and-boxes.component";

export interface BoxRequest {
  name: string | null | undefined;
}

@Component({
  selector: 'app-add-box-modal',
  standalone: true,
  imports: [
    FormsModule,
    PositiveIntegerDirective,
    ReactiveFormsModule
  ],
  templateUrl: './add-box-modal.component.html',
  styleUrl: './add-box-modal.component.css'
})
export class AddBoxModalComponent {

  box: Box | null = null;
  name!: string;

  constructor(public dialogRef: MatDialogRef<AddServiceModalComponent>, private http: HttpClient,
              @Inject(MAT_DIALOG_DATA) public data: dataForBoxModal) {
    if (data && data.box) {
      this.box = data.box;
      this.name = data.box.name;
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  submit(): void {
    const boxRequest: BoxRequest = {
      name: this.name
    }
    if (this.box != null) {
      this.http.put("api/car-wash/box/" + this.box.id, boxRequest).subscribe();
    } else {
      this.http.post("api/car-wash/box/" + this.data.carWashId, boxRequest).subscribe();
    }
    this.dialogRef.close();
  }

}
