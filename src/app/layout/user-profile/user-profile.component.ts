import {Component, ElementRef, ViewChild} from '@angular/core';
import {HeaderComponent} from "../../components/header/header.component";
import {SettingsComponent} from "../../components/settings/settings.component";
import {FooterComponent} from "../../components/footer/footer.component";
import {User} from "../../models/user";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    HeaderComponent,
    SettingsComponent,
    FooterComponent,
    FormsModule
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent {

  user: User | null = null;
  profilePicUrl: string = 'assets/images/recomendation.png';
  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(private http: HttpClient) {
    this.http.get<User>("api/auth-server/user").subscribe(
      (user: User) => {
        this.user = user;
        if (this.user.photoUrl != null) {
          this.profilePicUrl = this.user.photoUrl;
        }
        console.log('User data:', this.user);
      }, error => {
        console.log(error);
      }
    );
  }

  onProfilePicClick() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      // Обновление изображения профиля в интерфейсе пользователя
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profilePicUrl = e.target.result;
      };
      reader.readAsDataURL(file);

      // Загрузка файла на сервер
      const formData: FormData = new FormData();
      formData.append('photo', file, file.name);

      const headers = new HttpHeaders({
        'enctype': 'multipart/form-data'
      });

      this.http.post("api/auth-server/user/photo", formData, { headers: headers }).subscribe(
        (response) => {
          console.log('Файл успешно загружен', response);
        },
        (error) => {
          console.error('Ошибка загрузки файла', error);
        }
      );
    }
  }

}
