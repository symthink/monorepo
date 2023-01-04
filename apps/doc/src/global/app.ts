
import { AppSvc } from '../global/app.service';
import { setupConfig } from '@ionic/core';

export default async () => {
  console.log('starting viewer app...')
  /**
   * The code to be executed should be placed within a default function that is
   * exported by the global script. Ensure all of the code in the global script
   * is wrapped in the function() that is exported.
   */
  setupConfig({
    mode: 'ios',
  });
  AppSvc.init();
};
