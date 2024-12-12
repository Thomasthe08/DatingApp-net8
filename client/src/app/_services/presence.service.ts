import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {
  hubUrl = environment.hubsUrl;
  private hubConection?: HubConnection;
  private toastr = inject(ToastrService);
  onlineUsers = signal<string[]>([]);

  createHubConnection(user: User){
    this.hubConection = new HubConnectionBuilder().withUrl(
      this.hubUrl + 'presence', {accessTokenFactory: () => user.token}).withAutomaticReconnect().build();

      this.hubConection.start().catch(error => console.log(error));

      this.hubConection.on('UserIsOnline', username => {
        this.toastr.info(username + ' has connected');
      });
      this.hubConection.on('UserIsOffline', username => {
        this.toastr.warning(username + ' has disconnected');
      });

      this.hubConection.on('GetOnlineUsers', usernames => {
        this.onlineUsers.set(usernames)
      })

  }

  stopHubConnection(){
    if(this.hubConection?.state === HubConnectionState.Connected){
      this.hubConection.stop().catch(error => console.log(error));
    }
  }
}
