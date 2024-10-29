export class WashService {
  id: number;
  name: string;
  duration: number;
  price: number;

  constructor(id: number, name: string, duration: number, price: number) {
    this.id = id;
    this.name = name;
    this.duration = duration;
    this.price = price;
  }
}
