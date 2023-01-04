import { loadingController } from '@ionic/core';
import { Component, h, Listen, Host } from '@stencil/core';
import {
  SymThink,
  SymThinkDocument,
  symthinkPageTransition,
} from '@symthink/i2d';
import { AppSvc } from '../../global/app.service';

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.scss',
  shadow: false,
})
export class AppRoot {
  ionNav: HTMLIonNavElement;

  symthinkDoc: SymThinkDocument;
  currentCard: SymThink;

  async componentWillLoad() {
    AppSvc.setMetadata();
    this.symthinkDoc = new SymThinkDocument();
    this.symthinkDoc.load(window['CONTENT']);
    AppSvc.hideSplashScreen();
  }

  async showLoading() {
    const loading = await loadingController.create({
      message: 'Loading...',
      duration: 3000,
    });
    loading.present();
  }

  @Listen('itemAction')
  onItemAction(evt: CustomEvent) {
    const item = evt.detail.value as SymThink;
    switch (evt.detail.action) {
      case 'support-clicked':
        const itemClicked = this.symthinkDoc.find(
          (card: SymThink) => item.id === card.id
        );
        if (!itemClicked) {
          console.error('Item not found in current doc');
          console.debug(this.symthinkDoc, item);
          return;
        }
        if (item.isKidEnabled()) {
          this.currentCard = item;
          this.navigate(evt.detail.domrect);
        }
        break;
      default:
        console.log('Event received but not handled in modal-bas-nav');
        console.debug(evt.detail);
    }
  }
  @Listen('docAction')
  async onDocAction(evt: CustomEvent) {
    switch (evt.detail.action) {
      case 'go-back':
        this.ionNav.pop();
        break;
      case 'go-top':
        this.ionNav.popToRoot();
        break;
      default:
    }
  }

  async navigate(_domrect?: DOMRect) {
    console.log('navigate', this.ionNav.childElementCount);
    this.ionNav.push(
      'app-doc',
      {
        data: this.currentCard,
        // domrect,
        level: this.ionNav.childElementCount,
      },
      {
        animationBuilder: symthinkPageTransition,
      }
    );
  }

  // to support skipping pages
  async onNavReceived(index: number) {
    if (index >= 0) {
      const view = await this.ionNav.getByIndex(index);
      if (view) {
        this.ionNav.popTo(view);
      }
    }
  }

  render() {
    return (
      <Host>
        <ion-nav
          swipeGesture
          ref={(el) => (this.ionNav = el as HTMLIonNavElement)}
          root="app-doc"
          rootParams={{
            data: this.symthinkDoc,
            level: 0,
          }}
        ></ion-nav>
      </Host>
    );
  }
}
