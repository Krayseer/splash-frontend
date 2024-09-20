import { Component } from '@angular/core';
import {NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {Router, RouterLink} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {MatDialog} from "@angular/material/dialog";
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
  selector: 'app-header',
  standalone: true,
  imports: [
    NgOptimizedImage,
    NgIf,
    NgForOf,
    RouterLink
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  user: any = null;

  notifications: PushNotification[] = [];
  invitations: Invitation[] = [];
  showNotificationsPopup = false;
  activeTab: string = 'notifications';
  showRedDot: boolean = false;

  constructor(private router: Router, private http: HttpClient, public dialog: MatDialog) {
    this.loadData()
  }

  loadData() {
    this.http.get('api/auth-server/user').pipe(
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

  goToOrder() {
    this.router.navigate(["/order"]);
  }

  goToMain() {
    this.router.navigate(["/main"]);
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

  setActiveTab(tab: string): void {
    this.activeTab = tab;
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
}
