import { Component, ViewChild } from '@angular/core';
import { AlertController, IonModal } from '@ionic/angular';
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
  deviceName = "";
  deviceId = "";
  serviceUuid = "";
  characteristicUuid = "";
  @ViewChild(IonModal) modal!: IonModal;
  message = 'This modal example uses triggers to automatically open a modal when the button is clicked.';
  shop_name: string = "";
  shop_address: string = "";
  shop_tele: string = "";
  inv_date: string = new Date().toISOString();
  inv_no: string = "";
  totalAmount = 0;
  discountAmount = 0;
  tax_percent = 0;
  taxAmount = 0;
  servicePercent = 0;
  serviceCharges = 0;
  netAmount = 0;
  item = {
    name: "",
    qty: 0,
    price: 0,
    amount: 0
  }
  items = [];
  isModalOpen = false;
  isFirstTime = true;
  IS_FIRST_TIME = "isFirstTime";
  printer_width = "220px"; // 58 mm;
  connectOrNot = "Not Connected";
  charLenghtForPrinter = 18; // total 30 chars for 58 mm, for stock name 18 chars ; So, 80 mm fits approximately total 41 characters, for stock name 29.


  getShopName(): string {
    return this.shop_name == "" ? "This area for the shop name." : this.shop_name;
  }

  getShopAddress(): string {
    return this.shop_address == "" ? "This area for the shop address." : this.shop_address;
  }

  getShopTele(): string {
    return this.shop_tele == "" ? "This area for the shop telephone." : this.shop_tele;
  }

  getInvoiceNo(): string {
    return this.inv_no == "" ? "Generate Invoice Number" : this.inv_no;
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  cancel() {
    this.setOpen(false);
  }

  confirm() {
    this.setOpen(false);
    localStorage.setItem('shop_name', this.shop_name);
    localStorage.setItem('shop_address', this.shop_address);
    localStorage.setItem('shop_tele', this.shop_tele);
    localStorage.setItem('servicePercent', this.servicePercent + "");
    localStorage.setItem('tax_percent', this.tax_percent + "");
    localStorage.setItem('discount', this.discountAmount + "");
    localStorage.setItem(this.IS_FIRST_TIME, "true");
  }

  onWillDismiss(event: CustomEvent<OverlayEventDetail>) {
    if (event.detail.role === 'confirm') {
      this.message = `Hello, ${event.detail.data}!`;
    }
  }

  constructor(private alertController: AlertController, private bluetoothOperationsService: BluetoothPrinterService) {
    bluetoothOperationsService.Initialize();
    console.log("Is First time " + localStorage.getItem(this.IS_FIRST_TIME));
    this.isFirstTime = localStorage.getItem(this.IS_FIRST_TIME) == null ? true : false;
    this.bluetoothOperationsService.VerifyAndEnabled();
  }

  ngOnInit() {
    if (this.isFirstTime) {
      this.setOpen(true);
    }
    const values = this.splitAndPadString("You want each substring to exactly", this.charLenghtForPrinter);

    values.forEach(async (chunk, index) => {
      let writedata = `${index + 1}. "${chunk}"`;
      if(index == 0){
        writedata = writedata  + this.splitAndPadString("  1", 5) + this.splitAndPadString("1000", 7);
      }
      console.log(writedata);
    });
    this.shop_name = localStorage.getItem("shop_name")!;
    this.shop_address = localStorage.getItem("shop_address")!;
    this.shop_tele = localStorage.getItem("shop_tele")!;
    this.tax_percent = Number(localStorage.getItem("tax_percent")!);
    this.servicePercent = Number(localStorage.getItem("servicePercent")!);
    this.discountAmount = Number(localStorage.getItem("discount"));
    this.deviceId = this.bluetoothOperationsService.getBTDeviceId();

    if (this.deviceId == null || this.deviceId.length == 0) {
      this.connectOrNot = "Not Connected";
    } else {
      this.bluetoothOperationsService.ConnectToDevice(this.deviceId);
      this.connectOrNot = "Connected";
      this.serviceUuid = this.bluetoothOperationsService.getBTServiceUUID();
      this.characteristicUuid = this.bluetoothOperationsService.getBTCharUUID();
      this.deviceName = this.bluetoothOperationsService.getBTDeviceName();
      console.log("Device " + this.deviceName + " - " + this.deviceId);
      console.log("Service uuid " + this.serviceUuid);
      console.log("Char uuid " + this.characteristicUuid);
    }
  }

  scanBluetooth() {
    this.bluetoothOperationsService.Scan();
    this.serviceUuid = this.bluetoothOperationsService.getBTServiceUUID();
    this.characteristicUuid = this.bluetoothOperationsService.getBTCharUUID();
    this.deviceName = this.bluetoothOperationsService.getBTDeviceName();
    console.log("Device " + this.deviceName + " - " + this.deviceId);
    console.log("Service uuid " + this.serviceUuid);
    console.log("Char uuid " + this.characteristicUuid);
  }

  splitAndPadString(str: string, limit: number): string[] {
    const result: string[] = [];

    for (let i = 0; i < str.length; i += limit) {
      let chunk = str.slice(i, i + limit);
      if (chunk.length < limit) {
        chunk = chunk.padEnd(limit, ' '); // pad with spaces to match the limit
      }
      result.push(chunk);
    }

    return result;
  }

  // Example usage
  input = "My name is Naing Htwe Oo. Thank you for your help";


  async testPrintClick() {
    this.deviceId = this.bluetoothOperationsService.getBTDeviceId();
    this.serviceUuid = this.bluetoothOperationsService.getBTServiceUUID();
    this.characteristicUuid = this.bluetoothOperationsService.getBTCharUUID();
    if (this.deviceId == null || this.deviceId.length == 0) {
      this.bluetoothOperationsService.presentToast('Please connect the BT device first.')
      return;
    }
    //When user clicks on print button we should connect to printer and print as per our requirement
    await this.bluetoothOperationsService.Connect(this.deviceId);
    await this.bluetoothOperationsService.TurnOnBold(this.deviceId, this.serviceUuid, this.characteristicUuid);
    await this.bluetoothOperationsService.FeedCenter(this.deviceId, this.serviceUuid, this.characteristicUuid);

    await this.bluetoothOperationsService.WriteData(this.deviceId, this.serviceUuid, this.characteristicUuid, this.shop_name);
    await this.bluetoothOperationsService.TurnOffBold(this.deviceId, this.serviceUuid, this.characteristicUuid);
    await this.bluetoothOperationsService.WriteData(this.deviceId, this.serviceUuid, this.characteristicUuid, this.shop_address);
    await this.bluetoothOperationsService.WriteData(this.deviceId, this.serviceUuid, this.characteristicUuid, this.shop_tele);
    this.inv_date = new Date().toISOString();;
    await this.bluetoothOperationsService.WriteData(this.deviceId, this.serviceUuid, this.characteristicUuid, this.inv_date);
    await this.bluetoothOperationsService.UnderLine(this.deviceId, this.serviceUuid, this.characteristicUuid);
    await this.bluetoothOperationsService.FeedLeft(this.deviceId, this.serviceUuid, this.characteristicUuid);

    await this.bluetoothOperationsService.WriteData(this.deviceId, this.serviceUuid, this.characteristicUuid, this.splitAndPadString("Item", this.charLenghtForPrinter) + ` Qty  Price `);
    await this.bluetoothOperationsService.UnderLine(this.deviceId, this.serviceUuid, this.characteristicUuid);

    const values = this.splitAndPadString("You want each substring to exactly", this.charLenghtForPrinter);

    values.forEach(async (chunk, index) => {
      let writedata = `${index + 1}. "${chunk}"`;
      if(index == 0){
        writedata = writedata  + this.splitAndPadString("  1", 5) + this.splitAndPadString("1000", 7);
      }
      await this.bluetoothOperationsService.WriteData(this.deviceId, this.serviceUuid, this.characteristicUuid, writedata);
      console.log(writedata);
    });
    await this.bluetoothOperationsService.NewEmptyLine(this.deviceId, this.serviceUuid, this.characteristicUuid);

    await this.bluetoothOperationsService.FeedCenter(this.deviceId, this.serviceUuid, this.characteristicUuid);
    await this.bluetoothOperationsService.WriteData(this.deviceId, this.serviceUuid, this.characteristicUuid, "---Thank you---");
    await this.bluetoothOperationsService.FeedLeft(this.deviceId, this.serviceUuid, this.characteristicUuid);

    await this.bluetoothOperationsService.NewEmptyLine(this.deviceId, this.serviceUuid, this.characteristicUuid);
    await this.bluetoothOperationsService.NewEmptyLine(this.deviceId, this.serviceUuid, this.characteristicUuid);
    await this.bluetoothOperationsService.NewEmptyLine(this.deviceId, this.serviceUuid, this.characteristicUuid);

    await this.bluetoothOperationsService.Disconnect(this.deviceId);



    await this.bluetoothOperationsService.FeedRight(this.deviceId, this.serviceUuid, this.characteristicUuid);
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
    if (this.isBTCanEnable) {
      this.isBluetoothEnabled = !this.isBluetoothEnabled;
      if (this.isBluetoothEnabled) {
        this.enableBT();
      } else {
        this.closeBT();
      }
    } else {
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
