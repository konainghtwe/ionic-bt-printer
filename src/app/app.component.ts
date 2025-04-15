import { Component } from '@angular/core';
import { BleClient, BleService, textToDataView } from '@capacitor-community/bluetooth-le';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor() {}

  async Initialize() {
    await BleClient.initialize({ androidNeverForLocation: true });
  }
}
