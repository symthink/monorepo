import { ViewController } from '@ionic/core';
import { Component, h, Listen, State } from '@stencil/core';
import {
  SymThink,
  symthinkPageTransition,
} from '@symthink/i2d';
import { Subject } from 'rxjs';
import {
  AppSvc,
  IncomingMsgActionEnum,
  OutgoingMsgActionEnum,
} from '../../global/app.service';

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.scss',
  shadow: false,
})
export class AppRoot {
  ionNav: HTMLIonNavElement;
  edit = false;
  @State() loaded = false;

  currentFileId: string;
  currentCardId: string;
  currentCard: SymThink;
  nav$: Subject<number>;
  spinnerBackrop$: Subject<void>;
  lastChildElementCount: number = 1;

  @Listen('itemAction')
  onItemAction(evt: CustomEvent) {
    const item = evt.detail.value as SymThink;
    console.log('item clicked', item);
    switch (evt.detail.action) {
      case 'support-clicked':
        const itemClicked = AppSvc.symthinkDoc.find(
          (card: SymThink) => item.id === card.id
        );
        if (!itemClicked) {
          console.error('Item not found in current doc');
          console.debug(AppSvc.symthinkDoc, item);
          return;
        }
        if (item.isKidEnabled()) {
          this.currentCard = item;
          this.currentCardId = item.id;
          this.navigate(evt.detail.domrect);
        }
        break;
        case 'subcription-clicked':
          const url: URL = evt.detail.value;
          AppSvc.sendMessage(OutgoingMsgActionEnum.OPEN, url.toString());
        break;
      default:
        console.log('Event received but not handled in app-root');
        console.debug(evt.detail);
    }
  }

  @Listen('cardExternalMod')
  async onCardExternalMod() {
    AppSvc.onDocModified();
  }

  @Listen('docAction')
  async onDocAction(evt: CustomEvent) {
    switch (evt.detail.action) {
      case 'modified':
        AppSvc.onDocModified();
        break;
      case 'go-back':
        const appDocVC: ViewController = await this.ionNav.getByIndex(
          this.ionNav.childElementCount - 2
        );
        if (appDocVC) {
          const appDocEl = appDocVC.element as HTMLAppDocElement;
          // console.log('app-doc', appDocEl)
          appDocEl.comingBack();
        }
        this.ionNav.pop();
        break;
      case 'go-top':
        this.ionNav.popToRoot();
        break;
      case 'edit':
        window.postMessage(
          { action: IncomingMsgActionEnum.EDITDOC, value: null },
          location.protocol + '//' + location.host
        );
        break;
      default:
    }
  }


  async componentWillLoad() {
    this.nav$ = new Subject();
    this.nav$.subscribe((x) => this.onNavReceived(x));
    const didLoad = () => {this.loaded = true};
    window.addEventListener('message', (msgEvent: MessageEvent) => AppSvc.onPostMessageReceived(msgEvent, didLoad));
  }

  componentDidRender() {
    if (this.loaded && this.ionNav) {
      this.ionNav.addEventListener('ionNavDidChange', async () => {
        const viewController = await this.ionNav.getActive();
        AppSvc.currentSymthink = viewController.params.symthink as SymThink;
        if (this.lastChildElementCount > this.ionNav.childElementCount) {
          // going back
          const pages = AppSvc.currentSymthink.getPageIDs();
          window.postMessage(
            { action: OutgoingMsgActionEnum.PAGECHANGE, value: pages },
            location.protocol + '//' + location.host
          );
        }
        this.lastChildElementCount = this.ionNav.childElementCount;
      });
    }
  }

  async onNavReceived(index: number) {
    if (index >= 0) {
      const view = await this.ionNav.getByIndex(index);
      if (view) {
        this.ionNav.popTo(view);
      }
    }
  }

  async navigate(_domrect?: DOMRect) {
    this.ionNav.push(
      'app-doc',
      {
        symthink: this.currentCard,
        nav$: this.nav$,
        mod$: AppSvc.mod$,
        // domrect,
        level: this.ionNav.childElementCount,
      },
      {
        animationBuilder: symthinkPageTransition,
      }
    );
  }

  render() {
    if (this.loaded) {
      return (
        <ion-nav
          swipeGesture
          ref={(el) => (this.ionNav = el as HTMLIonNavElement)}
          root="app-doc"
          rootParams={{
            symthink: AppSvc.symthinkDoc,
            nav$: this.nav$,
            mod$: AppSvc.mod$,
            canEdit: AppSvc.editing,
            level: 0,
          }}
        ></ion-nav>
      );
    } else {
      return (
        <div class="flx-col-ctr">
          <div>&nbsp;</div>
          <div class="flx-row-ctr">
            <div>&nbsp;</div>
            <div class="centered-text sym-text">
              <ion-spinner></ion-spinner>
              <span>&nbsp;Loading...</span>
            </div>
            <div>&nbsp;</div>
          </div>
          <div>&nbsp;</div>
        </div>
      );
    }
  }
}
