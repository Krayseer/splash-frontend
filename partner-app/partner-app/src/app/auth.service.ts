import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private kcService: KeycloakService) { }

  async isLoggedIn(): Promise<boolean>{
    return await this.kcService.isLoggedIn();
  }

  async userInfo(): Promise<KeycloakProfile | null>{
    const isLoggedIn = await this.isLoggedIn();
    if(isLoggedIn) {
      return await {
        firstName: (await this.kcService.loadUserProfile()).firstName,
        lastName: (await this.kcService.loadUserProfile()).lastName,
        email: (await this.kcService.loadUserProfile()).email
      }
    };
    return null;
  }

  accessToken: string = '';
  async getAccessToken(){
    try {
      this.accessToken = await this.kcService.getToken().then((resp) => {return resp});
      console.log('accessToken :>> ', this.accessToken);
      localStorage.setItem('token', this.accessToken);
    } catch (error) {
      console.log('error :>> ', error);
    }
  }

  isTokenExpired(): boolean{
    return this.kcService.isTokenExpired();
  }

  getRoles(): string[]{
    return this.kcService.getUserRoles();
  }

  login(){
    this.kcService.login();
  }

  logout(){
    this.kcService.logout();
  }
}
