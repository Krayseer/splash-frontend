export class SendOrder {
  carWashId: number;
  serviceIds: number[];
  time: string;
  typePayment: string;

  constructor(carWashId: number, serviceIds: number[], startTime: string, typePayment: string) {
    this.carWashId = carWashId;
    this.serviceIds = serviceIds;
    this.time = startTime;
    this.typePayment = typePayment;
  }
}
