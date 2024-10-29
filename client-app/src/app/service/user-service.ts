import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {RegisterUser} from "../models/register-user";
import {CommonModule} from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {}

  registerUser(user: RegisterUser): Observable<any> {
    return this.http.post<any>('api/user/register', user);
  }
}
