import '@ionic/core';
import { setupConfig } from '@ionic/core';
import { AppSvc } from './app.service';

// import app service class
export default () => {

  // sets <html mode="ios" ... for ionic component platform styles
  setupConfig({
    mode: 'ios',
  });

  AppSvc.init();
};
