import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.calvinoo.btprinter',
  appName: 'ionic-bt-printer',
  webDir: 'www',
  plugins: {
    StatusBar: {
      overlaysWebView: false,
      style: "DARK",
      backgroundColor: "#ffffffff",
    },
    bluetoothLe: {
      displayStrings: {
        scanning: 'Scanning...',
        cancel: 'Cancel',
        availableDevices: 'Available devices',
        noDeviceFound: 'No device found'
      }
    }
  }
};

export default config;
