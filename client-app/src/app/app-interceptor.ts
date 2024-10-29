import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from "./auth.service";

@Injectable()
export class AppInterceptorInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    console.log('Request Http Interceptor ...');

    this.authService.getAccessToken();
    const authToken = localStorage.getItem('token');

    const newHeaders = new HttpHeaders({
      'Content-Type':'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTION',
      'Authorization' : `Bearer ${authToken}`
    });

    //clone request and change header
    request = request.clone( {
      headers: newHeaders
    });
    return next.handle(request);
  }
}
