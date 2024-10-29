import { Component } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "../../../models/user";
import {Router, RouterLink} from "@angular/router";
import {NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {forkJoin, switchMap} from "rxjs";

export interface PushNotification {
  id: number;
  subject: string;
  message: string;
  createdAt: string;
}

export interface ConfigurationSimple {
  id: number;
  name: string;
}

export enum InvitationState {
  SENT = 'SENT',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED'
}

export interface Invitation {
  id: number;
  username: string;
  configuration: ConfigurationSimple;
  roles: string[];
  invitationState: InvitationState;
}

@Component({
  selector: 'app-partner-header',
  templateUrl: './partner-header.component.html',
  styleUrl: './partner-header.component.css'
})
export class PartnerHeaderComponent {

  user: any = null;
  activeTab: string = 'tab1';
  notifications: PushNotification[] = [];
  invitations: Invitation[] = [];
  showNotificationsPopup = false;
  notActiveTab: string = 'notifications';
  showRedDot: boolean = false;

  constructor(private http: HttpClient, private router: Router) {
    //this.loadData();
  }

  loadData() {
    this.http.get('backend/user').pipe(
      switchMap(user => {
        this.user = user;
        console.log('Current user is ', user);

        // Выполняем два параллельных запроса после получения пользователя
        return forkJoin({
          notifications: this.http.get<PushNotification[]>('api/notification/push'),
          invitations: this.http.get<Invitation[]>('api/car-wash/invitation')
        });
      })
    ).subscribe(
      ({ notifications, invitations }) => {
        this.notifications = notifications;
        this.invitations = invitations;
        this.showRedDot = (this.notifications && this.notifications.length > 0) || (this.invitations && this.invitations.length > 0);
        console.log('Notifications: ', notifications);
        console.log('Invitations: ', invitations);
      },
      error => {
        console.error('Error fetching user, notifications, or invitations', error);
      }
    );
  }

  redirectToLogin() {
    this.router.navigate(['/auth']);
  }

  logout() {
    localStorage.removeItem('user');
  }

  toggleNotificationsPopup() {
    this.showNotificationsPopup = !this.showNotificationsPopup;
  }

  applyInvitation(id: number) {
    this.http.post("api/car-wash/invitation/apply/" + id, {}).subscribe(
      data => {
        this.loadData()
      }
    );
  }

  rejectInvitation(id: number) {
    this.http.post("api/car-wash/invitation/decline/" + id, {}).subscribe(
      data => {
        this.loadData()
      }
    );
  }

  deleteNotification(id: number) {
    this.http.delete("api/notification/push/" + id, {}).subscribe(
      data => {
        this.loadData()
      }
    );
  }

  getSentInvitations(): Invitation[] {
    return this.invitations.filter(invitation => invitation.invitationState === InvitationState.SENT);
  }

  setNotActiveTab(tab: string): void {
    this.notActiveTab = tab;
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
    if (tab === 'tab3') {
      this.router.navigate(['/orders-schedule']);
    }
    if (tab === 'tab2') {
      this.router.navigate(['/services-and-boxes']);
    }
  }

  setTab(tab: string) {
    this.activeTab = tab;
  }

}
