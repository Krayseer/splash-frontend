import { Component } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {HttpClient} from "@angular/common/http";
import {RegisterUser} from "../../models/register-user";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css',
})
export class RegistrationComponent {

  registrationForm: FormGroup;
  user!: RegisterUser;

  constructor(private fb: FormBuilder, private http: HttpClient, private snackBar: MatSnackBar,
              private router: Router) {
    this.registrationForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required]
    });
  }

  redirectToLogin() {
    this.router.navigate(["/auth"]);
  }

  onSubmit() {
    if (this.registrationForm.valid) {
      // Получаем данные из формы
      const userData = this.registrationForm.value;

      // Присваиваем полученные данные переменной user
      this.user = userData;

      // Отправляем запрос на сервер с данными пользователя
      this.http.post('api/auth-server/user', userData).subscribe(
        (response: any) => {
          if (response == null) {
            this.snackBar.open('Пользователь с такими данными уже существует', 'Закрыть', {
              duration: 3000,
            });
          }
        },
        (error: any) => {
          // Произошла ошибка при выполнении запроса
          console.error('Ошибка запроса:', error);
          // Дополнительные действия в случае ошибки регистрации
        }
      );
    }
  }
}
