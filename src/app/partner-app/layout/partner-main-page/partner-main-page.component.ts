import {Component, OnInit} from '@angular/core';
import {PartnerHeaderComponent} from "../../components/partner-header/partner-header.component";
import {PartnerFooterComponent} from "../../components/partner-footer/partner-footer.component";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Router, RouterLink} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {catchError, switchMap, throwError} from "rxjs";

@Component({
  selector: 'app-partner-main-page',
  standalone: true,
  imports: [
    PartnerHeaderComponent,
    PartnerFooterComponent,
    RouterLink
  ],
  templateUrl: './partner-main-page.component.html',
  styleUrl: './partner-main-page.component.css'
})
export class PartnerMainPageComponent implements OnInit{

  activeOrdersCount!: number;
  processingOrdersCount!: number;
  processedOrdersCount!: number;
  waitConfirmOrdersCount!: number;

  constructor(private http: HttpClient, private router: Router, private snackBar: MatSnackBar) {

  }

  ngOnInit(): void {
    this.getUser()
      .pipe(
        catchError(error => {
          console.error('Error fetching user:', error);
          this.router.navigate(['/auth']); // Редирект в случае ошибки запроса пользователя
          return throwError(error);
        })
      )
      .subscribe(
        (userData: any) => {
          console.log('User loaded successfully:', userData);
          // После успешной загрузки пользователя делаем последовательные запросы
          this.getCarWash(userData.id)
            .pipe(
              catchError(error => {
                console.error('Error fetching car wash:', error);
                this.router.navigate(['/car-wash-reg']); // Редирект в случае ошибки запроса автомойки
                return throwError(error);
              })
            )
            .subscribe(
              (carWashData: any) => {
                console.log('Car wash loaded successfully:', carWashData);
                // Запросы к разным эндпоинтам для получения количества заказов
                this.getActiveOrdersCount(carWashData.id);
                this.getProcessingOrdersCount(carWashData.id);
                this.getProcessedOrdersCount(carWashData.id);
              },
              error => {
                console.error('Error fetching car wash:', error);
                this.router.navigate(['/error']); // Редирект в случае ошибки загрузки автомойки
              }
            );
        },
        error => {
          console.error('Error fetching user:', error);
          this.router.navigate(['/error']); // Редирект в случае ошибки загрузки пользователя
        }
      );
  }

  getUser() {
    return this.http.get('api/auth-server/user');
  }

  getCarWash(userId: number) {
    return this.http.get(`api/car-wash/configuration`);
  }

  getWaitConfirmOrdersCount(carWashId: number) {
    const params = new HttpParams().set('carWashId', carWashId);
    this.http.get<number>(`api/order/car-wash/wait-confirm/count`, {params})
      .subscribe(
        count => {
          this.waitConfirmOrdersCount = count;
          console.log('Wait confirm orders count:', count);
        },
        error => {
          console.error('Error fetching wait confirm orders count:', error);
          this.router.navigate(['/error']); // Редирект в случае ошибки запроса количества активных заказов
        }
      );
  }

  getActiveOrdersCount(carWashId: number) {
    const params = new HttpParams().set('carWashId', carWashId);
    this.http.get<number>(`api/order/car-wash/active/count`, {params})
      .subscribe(
        count => {
          this.activeOrdersCount = count;
          console.log('Active orders count:', count);
        },
        error => {
          console.error('Error fetching active orders count:', error);
          this.router.navigate(['/error']); // Редирект в случае ошибки запроса количества активных заказов
        }
      );
  }

  getProcessingOrdersCount(carWashId: number) {
    const params = new HttpParams().set('carWashId', carWashId);
    this.http.get<number>(`api/order/car-wash/processing/count`, {params})
      .subscribe(
        count => {
          this.processingOrdersCount = count;
          console.log('Processing orders count:', count);
        },
        error => {
          console.error('Error fetching processing orders count:', error);
          this.router.navigate(['/error']); // Редирект в случае ошибки запроса количества заказов в обработке
        }
      );
  }

  getProcessedOrdersCount(carWashId: number) {
    const params = new HttpParams().set('carWashId', carWashId);
    this.http.get<number>(`api/order/car-wash/processed/count`, {params})
      .subscribe(
        count => {
          this.processedOrdersCount = count;
          console.log('Processed orders count:', count);
        },
        error => {
          console.error('Error fetching processed orders count:', error);
          this.router.navigate(['/error']); // Редирект в случае ошибки запроса количества обработанных заказов
        }
      );
  }

}
