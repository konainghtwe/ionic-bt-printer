import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import type { OverlayEventDetail } from '@ionic/core';
import { BluetoothPrinterService } from '../bt-printer';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

  isBluetoothEnabled = false;
  isBTCanEnable = false;
  deviceId = "";
  serviceUuid = "";
  characteristicUuid = "";

  constructor(private alertController: AlertController, private bluetoothOperationsService : BluetoothPrinterService) {
    bluetoothOperationsService.Initialize();
  }

  ngOnInit(){
    this.bluetoothOperationsService.Scan();
  }

  async testPrintClick(){
    //When user clicks on print button we should connect to printer and print as per our requirement
    await this.bluetoothOperationsService.Connect(this.deviceId);
    await this.bluetoothOperationsService.TurnOnBold(this.deviceId, this.serviceUuid, this.characteristicUuid);
    await this.bluetoothOperationsService.FeedCenter(this.deviceId, this.serviceUuid, this.characteristicUuid);

    await this.bluetoothOperationsService.WriteData(this.deviceId, this.serviceUuid, this.characteristicUuid, "Bangkok Shop");
    await this.bluetoothOperationsService.UnderLine(this.deviceId, this.serviceUuid, this.characteristicUuid);
    await this.bluetoothOperationsService.TurnOffBold(this.deviceId, this.serviceUuid, this.characteristicUuid);
    await this.bluetoothOperationsService.FeedRight(this.deviceId, this.serviceUuid, this.characteristicUuid);

    const currentDate = "14-04-2025";
    await this.bluetoothOperationsService.WriteData(this.deviceId, this.serviceUuid, this.characteristicUuid, currentDate);

    await this.bluetoothOperationsService.FeedLeft(this.deviceId, this.serviceUuid, this.characteristicUuid);

    await this.bluetoothOperationsService.WriteData(this.deviceId, this.serviceUuid, this.characteristicUuid, `Customer: Naing Htwe Oo`);
    await this.bluetoothOperationsService.WriteData(this.deviceId, this.serviceUuid, this.characteristicUuid, `Item: Bluetooth Printer`);
    await this.bluetoothOperationsService.WriteData(this.deviceId, this.serviceUuid, this.characteristicUuid, `Qty: 1    Weight: 1.3 grms`);
    await this.bluetoothOperationsService.WriteData(this.deviceId, this.serviceUuid, this.characteristicUuid, `Price: 1000   Amount: BTH.1000`);

    await this.bluetoothOperationsService.NewEmptyLine(this.deviceId, this.serviceUuid, this.characteristicUuid);

    await this.bluetoothOperationsService.FeedCenter(this.deviceId, this.serviceUuid, this.characteristicUuid);
    await this.bluetoothOperationsService.WriteData(this.deviceId, this.serviceUuid, this.characteristicUuid, "Please Collect after one hour.");
    await this.bluetoothOperationsService.WriteData(this.deviceId, this.serviceUuid, this.characteristicUuid, "---Thank you---");
    await this.bluetoothOperationsService.FeedLeft(this.deviceId, this.serviceUuid, this.characteristicUuid);

    await this.bluetoothOperationsService.NewEmptyLine(this.deviceId, this.serviceUuid, this.characteristicUuid);

    await this.bluetoothOperationsService.Disconnect(this.deviceId);
  }

  btCanEnable() {
    // BluetoothSerial
    //   .canEnable()
    //   .then((response: BluetoothState) => {
    //     const canEnable = response.enabled;
    //     console.log(`Bluetooth can be enabled ? ${canEnable}`);
    //     this.isBTCanEnable = canEnable;
    //     if(!canEnable){
    //       this.isBluetoothEnabled = canEnable;
    //         this.presentBTSettingAlert();
    //     }

    //   })
    //   .catch(() => {
    //     console.log('Error checking if bluetooth can be enabled');
    //   });
  }

  btenablechange(event: any) {
    console.log("Event " + event);
    if(this.isBTCanEnable){
      this.isBluetoothEnabled = !this.isBluetoothEnabled;
      if (this.isBluetoothEnabled) {
        this.enableBT();
      } else {
        this.closeBT();
      }
    }else{
      this.btCanEnable();
    }
   
  }

  enableBT() {
    // BluetoothSerial
    //   .enable()
    //   .then((response: BluetoothState) => {
    //     const status = response.enabled ? 'enabled' : 'disabled';
    //     console.log(`Bluetooth is ${status}`);
    //     this.isBluetoothEnabled = response.enabled;
    //   })
    //   .catch(() => {
    //     console.log('Error enabling bluetooth');
    //   });
  }

  closeBT() {
    // BluetoothSerial
    //   .disable()
    //   .then((response: BluetoothState) => {
    //     const status = response.enabled ? 'enabled' : 'disabled';
    //     console.log(`Bluetooth is ${status}`);
    //     this.isBluetoothEnabled = response.enabled;
    //   })
    //   .catch(() => {
    //     console.log('Error disabling bluetooth');
    //   });
  }

  checkBTEnable() {
    // BluetoothSerial
    //   .isEnabled()
    //   .then((response: BluetoothState) => {
    //     const status = response.enabled ? 'enabled' : 'disabled';
    //     console.log(`Bluetooth is ${status}`);
    //     // this.isBluetoothEnabled = response.enabled;
    //   })
    //   .catch(() => {
    //     console.log('Error checking bluetooth status');
    //   });
  }

  public btalertButtons = [
    {
      text: 'Go To Setting',
      role: 'confirm',
      handler: () => {
        console.log('Alert confirmed');
      },
    },
  ];

  async presentBTSettingAlert() {
    const alert = await this.alertController.create({
      header: 'Bluetooth Action',
      subHeader: 'Cannot Access Bluetooth',
      message: 'Please make sure to access the Bluetooth setting.',
      buttons: this.btalertButtons,
    });

    await alert.present();
  }

}
