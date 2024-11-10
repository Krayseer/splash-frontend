export class User {
  id: number;
  name: string;
  surname: string;
  username: string;
  email: string;
  phoneNumber: string;
  createdAt: Date;
  photoUrl: string;

  constructor(id: number, name: string, surname: string, username: string,
              email: string, phoneNumber: string, createdAt: Date, photoUrl: string) {
    this.id = id;
    this.name = name;
    this.surname = surname;
    this.username = username;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.createdAt = createdAt;
    this.photoUrl = photoUrl;
  }
}
