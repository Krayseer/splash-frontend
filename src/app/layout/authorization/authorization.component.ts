import { Component } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "../../models/user";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-authorization',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './authorization.component.html',
  styleUrl: './authorization.component.css'
})
export class AuthorizationComponent {

  authForm: FormGroup;

  constructor(private http: HttpClient, private fb: FormBuilder, private router: Router) {
    this.authForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  redirectToRegister() {
    this.router.navigate(["/registration"]);
  }

  onSubmit() {
    const userData = this.authForm.value;
    this.http.get<User>("api/auth-server/user", userData).subscribe(
      (response: any) => {
        console.log('Авторизация: ', response)
      },
      (error: any) => {
        // Произошла ошибка при выполнении запроса
        console.error('Ошибка запроса:', error);
        // Дополнительные действия в случае ошибки регистрации
      }
    );
  }
}
