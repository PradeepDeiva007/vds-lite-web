import { Component } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [ConfirmationService]
})
export class AppComponent {

  title = 'vds-lite-web';

  constructor(private swPush: SwPush) {
    if (this.swPush.isEnabled) {
      this.swPush.notificationClicks.subscribe(
          event => {
              window.focus();
              window.open('http://127.0.0.1:8080/#/shipmentplanapproval', '_self');
          },
          error => {
              // handle error
          }
      );
  }
   }

}

