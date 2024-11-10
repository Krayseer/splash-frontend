import {WashService} from "./wash-service";

export class CarWash {
  id: number;
  name: string;
  description: string;
  phoneNumber: string;
  address: string;
  services: WashService[];

  constructor(id: number, name: string, description: string, phoneNumber: string, address: string,
              services: WashService[]) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.phoneNumber = phoneNumber;
    this.address = address;
    this.services = services;
  }
}
