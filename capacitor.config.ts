import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.symthink',
  appName: 'symthink',
  webDir: 'apps/editor/www',
  bundledWebRuntime: false,
  "plugins": {
    SplashScreen: {
      launchAutoHide: false,
      backgroundColor: "#ffffffff",
      showSpinner: false
    },
    Keyboard: {
      resize: "ionic",
      style: "dark",
      resizeOnFullScreen: true,
    },
  }
};

export default config;
