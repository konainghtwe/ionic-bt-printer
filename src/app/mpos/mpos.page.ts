import { Component, OnInit } from '@angular/core';
import { BluetoothPrinterService } from '../bt-printer';
import { OverlayEventDetail } from '@ionic/core';

@Component({
  selector: 'app-mpos',
  standalone: false,
  templateUrl: './mpos.page.html',
  styleUrls: ['./mpos.page.scss'],
})
export class MposPage implements OnInit {

  showProduct = true;
  showManage = false;
  showReceipt = false;
  showCart = true;
  name = "";
  price = 0;
  total = 0;
  receipt_date = "";
  items = JSON.parse(localStorage.getItem('items')!) || [
    { name: 'Latte', price: 3.5 },
    { name: 'Cappuccino', price: 4.0 },
    { name: 'Espresso', price: 2.5 },
    { name: 'Tea', price: 2.0 },
    { name: 'Americano', price: 3.0 },
    { name: 'Mocha', price: 4.25 },
    { name: 'Macchiato', price: 3.75 },
    { name: 'Hot Chocolate', price: 3.5 }
  ];

  cart : any = [];

  saveItemsToLocalStorage() {
    localStorage.setItem('items', JSON.stringify(this.items));
  }

  addItem() {
    if (this.name && !isNaN(this.price)) {
      const item: { name: string, price: number} = {
        name: this.name,
        price: this.price
      };
      this.items.push(item);
      this.saveItemsToLocalStorage();
      this.name = "";
      this.price = 0;
    } else {
      alert("Please provide valid item details.");
    }
  }

  editItem(index : number) {
    const item = this.items[index];
    this.name = item.name;
    this.price = item.price;
    this.deleteItem(index);
  }

  deleteItem(index : number) {
    this.items.splice(index, 1);
    this.saveItemsToLocalStorage();
  }

  addToCart(item : any) {
    this.cart.push(item);
    this.total += item.price;
  }

  checkout(){
    const now = new Date();
    this.receipt_date = now.toLocaleString();
    this.showCart = false;
    this.showReceipt = true;
  }
  
  showProducts() {
    this.showProduct = true;
    this.showManage = false;
  }

  showManageItems() {
    this.showProduct = false;
    this.showManage = true;
  }

  deviceName = "";
  deviceId = "";
  serviceUuid = "";
  characteristicUuid = "";
  isModalOpen = false;
  isFirstTime = true;
  IS_FIRST_TIME = "isFirstTime";
  printer_width = "220px"; // 58 mm;
  connectOrNot = "Not Connected";
  charLenghtFor58MM = 23;
  charLenghtFor80MM = 34;
  charLenghtForPrinter = this.charLenghtFor58MM;
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

  constructor(private bluetoothOperationsService: BluetoothPrinterService) { 
    this.isFirstTime = localStorage.getItem(this.IS_FIRST_TIME) == null ? true : false;
  }

  ngOnInit() {
    if (this.isFirstTime) {
      this.showManage = true;
      this.showProduct = false;
      this.setOpen(true);
    }
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

  updateReceiptWidthFor88(){
    this.charLenghtForPrinter = this.charLenghtFor80MM;
  }

  updateReceiptWidthFor58(){
    this.charLenghtForPrinter = this.charLenghtFor58MM;
  }

  async printReceipt() {
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
    await this.bluetoothOperationsService.WriteData(this.deviceId, this.serviceUuid, this.characteristicUuid, this.receipt_date);
    await this.bluetoothOperationsService.UnderLine(this.deviceId, this.serviceUuid, this.characteristicUuid);
    await this.bluetoothOperationsService.FeedLeft(this.deviceId, this.serviceUuid, this.characteristicUuid);

    for(let data of this.cart){
      const values = this.splitAndPadString(data.name, this.charLenghtForPrinter);

      values.forEach(async (chunk, index) => {
        let writedata = `${chunk}`;
        if(index == 0){
          writedata = writedata  + this.splitAndPadString(data.price, 7);
        }
        await this.bluetoothOperationsService.WriteData(this.deviceId, this.serviceUuid, this.characteristicUuid, writedata);
        console.log(writedata);
      });
    }
    
    await this.bluetoothOperationsService.UnderLine(this.deviceId, this.serviceUuid, this.characteristicUuid);

    await this.bluetoothOperationsService.FeedCenter(this.deviceId, this.serviceUuid, this.characteristicUuid);
    await this.bluetoothOperationsService.WriteData(this.deviceId, this.serviceUuid, this.characteristicUuid, "Thank you for your purchase!");
    await this.bluetoothOperationsService.WriteData(this.deviceId, this.serviceUuid, this.characteristicUuid, "Have a great day ☀️");
    await this.bluetoothOperationsService.FeedLeft(this.deviceId, this.serviceUuid, this.characteristicUuid);

    await this.bluetoothOperationsService.NewEmptyLine(this.deviceId, this.serviceUuid, this.characteristicUuid);

    await this.bluetoothOperationsService.Disconnect(this.deviceId);
    this.cart = [];
    this.total = 0;
    this.showReceipt = false;
    this.showCart = true;
  }

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

  scanBluetooth() {
    this.bluetoothOperationsService.Scan();
    this.serviceUuid = this.bluetoothOperationsService.getBTServiceUUID();
    this.characteristicUuid = this.bluetoothOperationsService.getBTCharUUID();
    this.deviceName = this.bluetoothOperationsService.getBTDeviceName();
    console.log("Device " + this.deviceName + " - " + this.deviceId);
    console.log("Service uuid " + this.serviceUuid);
    console.log("Char uuid " + this.characteristicUuid);
  }

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
      }
    }

}
