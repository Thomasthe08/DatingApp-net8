import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { User } from '../_models/user';
import { take } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {
  hubUrl = environment.hubsUrl;
  private hubConection?: HubConnection;
  private toastr = inject(ToastrService);
  private router = inject(Router);
  onlineUsers = signal<string[]>([]);

  createHubConnection(user: User){
    this.hubConection = new HubConnectionBuilder().withUrl(
      this.hubUrl + 'presence', {accessTokenFactory: () => user.token}).withAutomaticReconnect().build();

      this.hubConection.start().catch(error => console.log(error));

      this.hubConection.on('UserIsOnline', username => {
        this.onlineUsers.update(users => [...users, username]);
      });

      this.hubConection.on('UserIsOffline', username => {
        this.onlineUsers.update(users => users.filter(x => x !== username));
      });

      this.hubConection.on('GetOnlineUsers', usernames => {
        this.onlineUsers.set(usernames)
      });

      this.hubConection.on('NewMessageReceived', ({username, knownAs}) => {
        this.toastr.info(knownAs + 'has sent you a new message! Click me to see it').onTap.pipe(take(1)).subscribe(() => 
          this.router.navigateByUrl('/members/' + username + '?tab=Messages')
        )
      });

  }

  stopHubConnection(){
    if(this.hubConection?.state === HubConnectionState.Connected){
      this.hubConection.stop().catch(error => console.log(error));
    }
  }
}
