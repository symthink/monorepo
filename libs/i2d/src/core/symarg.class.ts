import { modalController } from '@ionic/core';

export class SymArg {

    constructor(id: string) {
      //get from db based on id
      return this;
    }

    async openFallacyKb() {
        console.log('openFallacyKb');
        const modal = await modalController.create({
          component: 'd2-fallacy-kb',
          backdropDismiss: true,
          showBackdrop: true,    
          cssClass: 'half-modal'
          // componentProps: {
          // }
        });
        return await modal.present();
    }

    startEdit() {

    }

    pay() {

    }

}