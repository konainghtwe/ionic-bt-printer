import { Injectable, OnDestroy } from '@angular/core';
import { BleClient, BleService, textToDataView } from '@capacitor-community/bluetooth-le';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class BluetoothPrinterService implements OnDestroy {

    BLUETOOTH_DEVICE_NAME = "bt_device_name";
    BLUETOOTH_DEVICE_ID = 'bt_device_id';
    BLUETOOTH_Service_UUID = "bt_serivce_uuid";
    BLUETOOTH_CHARACTERISTIC_UUID = "bt_char_uuid";


  constructor(private toastController: ToastController) { }

  async presentToast(msg : string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 1500,
      position: 'bottom',
    });

    await toast.present();
  }

  getBTDeviceName() : string{
    return localStorage.getItem(this.BLUETOOTH_DEVICE_NAME)!;
  }

  getBTDeviceId() : string{
    return localStorage.getItem(this.BLUETOOTH_DEVICE_ID)!;
  }

  getBTServiceUUID() : string {
    return localStorage.getItem(this.BLUETOOTH_Service_UUID)!;
  }

  getBTCharUUID() : string {
    return localStorage.getItem(this.BLUETOOTH_CHARACTERISTIC_UUID)!;
  }

  async Initialize() {
    await BleClient.initialize({ androidNeverForLocation: true });
  }

  async Connect(deviceId: string) {
    await BleClient.connect(deviceId);
  }

  async Disconnect(deviceId: string) {
    await BleClient.disconnect(deviceId);
  }

  async VerifyAndEnabled() {
    if (!await BleClient.isEnabled()) {
      await BleClient.enable();
    }
  }

  async ConnectToDevice(deviceId : string){
    await this.Initialize();
    let bleDevice = await BleClient.requestDevice({ allowDuplicates: false});
    if (bleDevice) {
      await BleClient.connect(deviceId, this.Disconnect);
      this.presentToast('Connected');
      localStorage.setItem(this.BLUETOOTH_DEVICE_NAME,bleDevice.name!)
      localStorage.setItem(this.BLUETOOTH_DEVICE_ID, deviceId)
      await this.AssignServices();
    }
    console.log("Ble Device " + bleDevice.name);
  }

  async Scan() {
    await this.VerifyAndEnabled();
    await this.Initialize();
    let bleDevice = await BleClient.requestDevice({ allowDuplicates: false });
    if (bleDevice) {
      await BleClient.connect(bleDevice.deviceId, this.Disconnect);
      this.presentToast('Connected');
      localStorage.setItem(this.BLUETOOTH_DEVICE_NAME,bleDevice.name!)
      localStorage.setItem(this.BLUETOOTH_DEVICE_ID, bleDevice.deviceId)
      await this.AssignServices();
    }
  }

  async AssignServices() {
    const deviceId = localStorage.getItem(this.BLUETOOTH_DEVICE_ID);
    let bleService: BleService[] = await BleClient.getServices(deviceId!);
    if (bleService.length > 0 && bleService[0].characteristics.length > 0) {
      console.log("UUID " + bleService[0].uuid);
      localStorage.setItem(this.BLUETOOTH_Service_UUID, bleService[0].uuid);
      localStorage.setItem(this.BLUETOOTH_CHARACTERISTIC_UUID, bleService[0].characteristics[0].uuid);
    }
  }

  async LineFeed(deviceId: string, serviceUuid: string, characteristicUuid: string) {
    await BleClient.write(deviceId, serviceUuid, characteristicUuid, new DataView((new Uint8Array([10])).buffer));
  }

  async TurnOnBold(deviceId: string, serviceUuid: string, characteristicUuid: string) {
    const boldOn = new Uint8Array([27, 69, 1]);
    await BleClient.write(deviceId, serviceUuid, characteristicUuid, new DataView(boldOn.buffer));
  }

  async TurnOffBold(deviceId: string, serviceUuid: string, characteristicUuid: string) {
    const boldOff = new Uint8Array([27, 69, 0]);
    await BleClient.write(deviceId, serviceUuid, characteristicUuid, new DataView(boldOff.buffer));
  }

  async FeedLeft(deviceId: string, serviceUuid: string, characteristicUuid: string) {
    const left = new Uint8Array([27, 97, 0]);
    await BleClient.write(deviceId, serviceUuid, characteristicUuid, new DataView(left.buffer));
  }

  async FeedCenter(deviceId: string, serviceUuid: string, characteristicUuid: string) {
    const center = new Uint8Array([27, 97, 1]);
    await BleClient.write(deviceId, serviceUuid, characteristicUuid, new DataView(center.buffer));
  }

  async FeedRight(deviceId: string, serviceUuid: string, characteristicUuid: string) {
    const right = new Uint8Array([27, 97, 2]);
    await BleClient.write(deviceId, serviceUuid, characteristicUuid, new DataView(right.buffer));
  }

  async WriteData(deviceId: string, serviceUuid: string, characteristicUuid: string, text: string) {
    await this.LineFeed(deviceId, serviceUuid, characteristicUuid);
    await BleClient.write(deviceId, serviceUuid, characteristicUuid, textToDataView(text));
  }

  async UnderLine(deviceId: string, serviceUuid: string, characteristicUuid: string) {
    await this.LineFeed(deviceId, serviceUuid, characteristicUuid);
    await BleClient.write(deviceId, serviceUuid, characteristicUuid, textToDataView('-'.repeat(30)));
  }

  async NewEmptyLine(deviceId: string, serviceUuid: string, characteristicUuid: string) {
    await this.LineFeed(deviceId, serviceUuid, characteristicUuid);
    await BleClient.write(deviceId, serviceUuid, characteristicUuid, textToDataView(`${' '.repeat(18)}\n`));
  }

  ngOnDestroy(): void {
  }
}