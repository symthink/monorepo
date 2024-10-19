import { alertController, modalController } from '@ionic/core';
import {
  Component,
  h,
  Host,
  Listen,
  Prop,
  Element,
  Event,
  EventEmitter,
  Method,
  State,
} from '@stencil/core';
import { ARG_TYPE, CardRules, SymThink, SymThinkDocument } from '@symthink/i2d';
import { Subject } from 'rxjs';
import { AppSvc, OutgoingMsgActionEnum } from '../../global/app.service';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

@Component({
  tag: 'app-doc',
  styleUrl: 'app-doc.scss',
  shadow: false,
})
export class AppDoc {
  @Element() el: HTMLElement;

  @Prop() symthink: SymThink;
  @Prop() nav$: Subject<number>;
  @Prop() mod$: Subject<void>;
  @Prop() domrect: DOMRect;
  @Prop() level: number;

  @Event() docAction: EventEmitter<{ action; value }>;

  editMode = false;
  recycle$ = new Subject<{ source; id }>();
  cardSubject = new Subject<string>();
  symthinkDoc: SymThinkDocument;
  next = CardRules.find((c) => ARG_TYPE.Statement === c.type);

  @State() reOrderDisabled = true;
  @State() change = false;

  // @Event() cardExternalMod: EventEmitter<void>;

  addItemToolbarEl: HTMLIonToolbarElement;
  pressTimer: number;

  private modified() {
    this.change = !this.change;
  }

  @Listen('itemAction')
  onItemAction(evt: CustomEvent) {
    const item = evt.detail.value as SymThink;
    const evnt = evt.detail.pointerEvent as PointerEvent;
    console.log('** itemAction **', evt.detail.action);
    switch (evt.detail.action) {
      case 'support-clicked':
        if (item.isKidEnabled()) {
          this.symthinkDoc.deselect();
        } else {
          item.select$.next(true);
        }
        break;
      case 'add-source':
        this.onAddSourceClick();
        break;
      case 'delete-source':
        AppSvc.presentConfirm('', 'Delete source?', true).then((yes) => {
          if (yes) {
            const o = evt.detail.value as { stid: string; index: number };
            if (this.symthink.rmChildSource(o.stid, o.index)) {
              AppSvc.mod$.next();
              this.cardSubject.next('external-mod');
              // this.cardExternalMod.emit();    
            }
          }
        });
        break;
      case 'item-opts-clicked':
        AppSvc.onItemOptionsSelect(
          item,
          evnt
        ).then((didChange) => {
          this.cardSubject.next('external-mod'); // will close sliding item
          if (didChange) {
            AppSvc.mod$.next();
            // this.cardExternalMod.emit(); // save doc
          }
        });
        break;
      case 'slide-opt-extend':
        AppSvc.handleItemOption(item, { role: 'extend' }).then((didChange) => {
          this.cardSubject.next('external-mod'); // will close sliding item
          if (didChange) {
            AppSvc.mod$.next(); // save doc
          }
        });
        break;
      case 'slide-opt-disablekids':
        AppSvc.handleItemOption(item, { role: 'disablekids' }).then((didChange) => {
          if (didChange) {
            AppSvc.mod$.next(); // save doc
          } else {
            this.cardSubject.next('external-mod'); // will close sliding item
          }
        });
        break;
      case 'slide-opt-recycle':
        AppSvc.handleItemOption(item, { role: 'recycle' }).then((didChange) => {
          if (didChange) {
            AppSvc.mod$.next(); // save doc
          } else {
            this.cardSubject.next('external-mod'); // will close sliding item
          }
        });
        break;
      case 'edit-full':
        AppSvc.sendMessage(OutgoingMsgActionEnum.EDITITEM, item.getRaw(false));
        break;
      default:
    }
  }

  @Listen('docAction')
  onDocAction(evt: CustomEvent) {
    // console.log('docAction received', evt.detail);
    switch (evt.detail.action) {
      case 'doc-title-change':
        AppSvc.mod$.next();
        break;
      case 'select-symthink':
        this.presentSymthinkSelectModal();
        break;
      case 'edit-mode':
        this.editMode = evt.detail.value;
        break;
      default:
    }
  }

  @Method()
  async comingBack() {
    this.cardSubject.next('external-mod');
  }

  get depth(): number {
    const { dep } = this.symthinkDoc.getDepth();
    return dep;
  }

  async removeItem(item: SymThink) {
    if (item.hasKids()) {
      const alert = await alertController.create({
        cssClass: 'confirm-archive',
        header: 'Confirm Remove',
        message: `Click Continue to move this support and any child supports into the Archive.  It will be available to re-use for up to 7 days.`,
        buttons: ['Cancel', { text: 'Continue', role: 'archive' }],
      });
      await alert.present();
      const { role } = await alert.onDidDismiss();
      if (role === 'archive') {
        item.makeOrphan();
      }
    } else {
      item.makeOrphan();
    }
  }

  async onAddSourceClick() {
    AppSvc.sendMessage(OutgoingMsgActionEnum.ADDSOURCE, this.symthink.id);
  }

  async componentWillLoad() {
    this.mod$.subscribe(() => this.cardSubject.next('external-mod'));
    if (this.symthink) {
      this.symthinkDoc = this.symthink.getRoot() as SymThinkDocument;
      const pages = this.symthink.getPageIDs();
      this.symthinkDoc.page$.next(pages);
      if (!this.symthink.hasItemText()) {
        this.symthink.select$.next(true);
      }
      if (this.symthinkDoc.log$) {
        this.symthinkDoc.log$.subscribe(() => this.modified());
      }
    }
  }

  async presentSymthinkSelectModal() {
    const modal = await modalController.create({
      component: 'app-select-modal-nav',
    });
    modal.present();
    const { data } = await modal.onDidDismiss();
    // console.log('Dimissed with data:', data);
    if (data?.card) {
      this.symthink.addChild(data.card);
      this.cardSubject.next('external-mod');
      AppSvc.mod$.next();
      // this.cardExternalMod.emit();
    }
  }

  async onHelpInfoClick(evt: MouseEvent) {
    evt.stopPropagation();
    evt.preventDefault();
    const modal = await modalController.create({
      component: 'app-doc-help',
    });
    modal.present();
  }

  async onOutlineClick(evt: MouseEvent) {
    evt.stopPropagation();
    evt.preventDefault();
    AppSvc.sendMessage(
      OutgoingMsgActionEnum.VIEWTREE,
      this.symthink.getPageIDs()
    );
  }

  async onSymthinkSelItemClick(_evt: MouseEvent) {
    if (this.symthink.maxKids()) {
      AppSvc.notifyMaxItemsReached();
    } else {
      await this.presentSymthinkSelectModal();
    }
  }

  async onByClick(e: MouseEvent) {
    AppSvc.onDocHeaderOptsSelect(this.symthinkDoc, e);
  }

  async onAddShareLink(_evt: MouseEvent) {
    if (this.symthink.maxKids()) {
      AppSvc.notifyMaxItemsReached();
    } else {
      AppSvc.presentNotice('Feature pending');
      // const urlString = await AppSvc.presentShareLinkInput();
    }
  }

  onQuickAddClick(type: ARG_TYPE, evt: MouseEvent): void {
    evt.stopImmediatePropagation();
    evt.preventDefault();
    if (this.symthinkDoc.deselect()) {
      this.cardSubject.next('external-mod');
    }
    this.symthink.enableKids();
    if (this.symthink.maxKids()) {
      AppSvc.notifyMaxItemsReached();
    } else {
      const item = this.symthink.addChild({
        id: this.symthink.genId(),
        type,
      });
      this.cardSubject.next('external-mod');
      AppSvc.mod$.next();
      this.modified();
      item.select$.next(true);
      // AppSvc.sendMessage(OutgoingMsgActionEnum.EDITITEM, item.getRaw(false));
    }
  }

  // onCreateClick() {
  //   this.docAction.emit({ action: 'create', value: true });
  // }

  // onEditClick() {
  //   this.docAction.emit({ action: 'edit', value: true });
  // }

  backLongpress = false;
  backPressTimeout: any;
  backTouchStart(e: TouchEvent | MouseEvent): void {
    e.stopPropagation();
    e.preventDefault();
    this.backLongpress = false;
    this.backPressTimeout = setTimeout(() => {
      this.backLongpress = true;
      this.goTop(e);
    }, 600);
  }
  backTouchEnd(e: TouchEvent | MouseEvent): void {
    clearTimeout(this.backPressTimeout);
    e.stopPropagation();
    e.preventDefault();
    if (!this.backLongpress) {
      this.goBack(e);
    }
  }

  goTop(e: TouchEvent | MouseEvent): void {
    e.stopPropagation();
    e.preventDefault();
    this.docAction.emit({ action: 'go-top', value: true });
  }

  goBack(e: TouchEvent | MouseEvent): void {
    e.stopPropagation();
    e.preventDefault();
    this.docAction.emit({ action: 'go-back', value: true });
  }

  onShareClick(e: TouchEvent | MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    AppSvc.sendMessage(OutgoingMsgActionEnum.SHARE, this.symthink.getRaw(true));
  }

  showBackButton(): boolean {
    return AppSvc.editing && this.level > 0;
  }

  showShareButton(): boolean {
    return AppSvc.editing && this.level === 1 && this.symthink.getLabel().toLowerCase() === 'platform';
  }

  showQuickAddFabList(): boolean {
    return AppSvc.saved && AppSvc.editing;
  }

  showMetrics(): boolean {
    return this.level === 1 && ['stories', 'platform'].includes(this.symthink.getLabel());
  }

  suppDisabled(): boolean {
    return this.symthink.numeric && this.symthink.support?.length > 9;
  }

  renderTouchBackBtn() {
    return (
      <ion-fab-button
        class="nav-back"
        onTouchStart={(e) => this.backTouchStart(e)}
        onTouchEnd={(e) => this.backTouchEnd(e)}
        onMouseDown={(e) => this.backTouchStart(e)}
        onMouseUp={(e) => this.backTouchEnd(e)}
        style={{
          margin: '15px 0px 0px 15px',
          '--background': '#e8e8e8',
          '--color': '#000000',
          '--box-shadow': 'none',
        }}
      >
        <ion-icon size="large" name="chevron-back-outline"></ion-icon>
        <ion-icon
          size="large"
          class="second-chevron"
          name="chevron-back-outline"
        ></ion-icon>
      </ion-fab-button>
    );
  }

  renderShareBtn() {
    return (
      <ion-fab-button
        onClick={(e) => this.onShareClick(e)}
        style={{
          margin: '15px 15px 0px 0px',
          '--background': '#e8e8e8',
          '--color': '#000000',
          '--box-shadow': 'none',
        }}
      >
        <ion-icon md="share-social-outline" ios="share-outline"></ion-icon>
      </ion-fab-button>
    );
  }

  renderAddSupportBtn(disable = false) {
    const innerStyle = disable ? {
      ...styles.leftSideBtnInner,
      backgroundColor: styles.leftSideBtnDisabled.backgroundColor
    } : styles.leftSideBtnInner;
    const textColor = disable ? styles.leftSideBtnDisabled.color : 'black';
    const fontWeight = disable ? styles.leftSideBtnDisabled.fontWeight : '400';
    const iconStyle = disable ? {
      ...styles.leftSideBtnIcon,
      color: styles.leftSideBtnDisabled.color
    } : styles.leftSideBtnIcon;
    return (
      <div
        style={styles.leftSideBtnOuter}
        class={{
          'ion-padding': AppSvc.isWidescreen,
        }}
        slot="card-list-bottom"
      >
        <div style={innerStyle}
          onClick={(e) => disable ? console.log('disabled') : this.onQuickAddClick(this.next.type, e)}>
          <ion-label style={{ width: '100%', textAlign: 'center' }}>
            <div style={{ color: textColor, fontWeight }}>Add&nbsp;item</div>
          </ion-label>
          <ion-icon style={iconStyle}
            name="add-outline"
          ></ion-icon>
        </div>
      </div>
    );
  }

  renderAddSourceBtn() {
    return (
      <div
        style={styles.leftSideBtnOuter}
        class={{
          'ion-padding': AppSvc.isWidescreen,
        }}
        slot="card-bottom"
      >
        <div style={styles.leftSideBtnInner}
          onClick={() => this.onAddSourceClick()}>
          <ion-label style={{ width: '100%', textAlign: 'center' }}>
            <div style={{ color: 'black', fontWeight: '400' }}>Add&nbsp;source</div>
          </ion-label>
          <ion-icon style={styles.leftSideBtnIcon}
            name="add-outline"
          ></ion-icon>
        </div>
      </div>
    );

  }

  render() {
    return (
      <Host>
        <d2-rcard
          canEdit={AppSvc.editing}
          data={this.symthink}
          notify={this.cardSubject}
          domrect={this.domrect}
        >
          <div slot="card-top" class="arrow-nav">
            {this.showBackButton() && this.renderTouchBackBtn()}
            {this.showShareButton() && this.renderShareBtn()}
          </div>
          {AppSvc.editing && this.renderAddSupportBtn(this.suppDisabled())}
          {(AppSvc.editing && this.level) && this.renderAddSourceBtn()}
        </d2-rcard>
      </Host>
    );
  }
}

const styles = {
  leftSideBtnOuter: {
    paddingTop: '30px',
    paddingBottom: '30px',
    display: 'flex',
    justifyContent: 'flex-start',
    width: '200px',
    marginLeft: '10px',
    height: '108px',
  },
  leftSideBtnInner: {
    backgroundColor: '#e8e8e8',
    width: '80%',
    borderRadius: '0px 25px 25px 0px',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: '12px'
  },
  leftSideBtnIcon: {
    fontSize: '1.5em',
    marginLeft: '8px',
    color: 'black',
    fontWeight: '400'
  },
  leftSideBtnDisabled: {
    backgroundColor: '#f3f3f3',
    color: '#8e8e8e',
    fontWeight: 'normal'
  }
}