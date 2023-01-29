import { alertController, IonTextareaCustomEvent } from '@ionic/core';
import {
  Component,
  h,
  Prop,
  State,
  Event,
  EventEmitter,
  Element,
  Watch,
} from '@stencil/core';
import { Subject } from 'rxjs';
import {
  SymThinkDocument,
  SymThink,
  CardRules,
  StLogActionEnum,
  trailingSympunkRegExp,
  ARG_TYPE,
} from '../../core/symthink.class';
// import getPercentageDifference from 'text-percentage-difference';

@Component({
  tag: 'd2-rcard',
  styleUrl: 'd2-rcard.scss',
  shadow: true,
})
export class D2Rcard {
  @Element() el: HTMLElement;

  /**
   * Cannot pass this via html attribute. Data must be an object reference,
   * so pass via JSX or Javascript.
   */
  @Prop() data: SymThinkDocument | SymThink;
  @Prop() canEdit = false;
  @Prop() notify?: Subject<string>;
  @Prop() closeBtn = false;
  @Prop() domrect?: DOMRect;
  @Prop() reOrderDisabled = true;
  contentEl: HTMLIonContentElement;
  @Watch('reOrderDisabled')
  async onReorderChange() {
    return this.listEl.closeSlidingItems();
  }
  @State() checkboxHidden = true;
  @State() change = false;

  @Event() itemAction: EventEmitter<{ action; value; domrect?: DOMRect }>;
  @Event() docAction: EventEmitter<{ action; value }>;

  private listEl: HTMLIonListElement;
  private currIonTextareaEl: HTMLIonTextareaElement;
  private selectedElHeight: number = 50;

  get showMoreOptions(): boolean {
    return this.canEdit;
  }

  disableSlideOpts(itm: SymThink) {
    if (!this.canEdit) return true;
    // else can edit
    return !this.reOrderDisabled || !!(itm.selected && !itm.isKidEnabled());
  }

  componentWillLoad() {
    if (this.notify) {
      this.notify.subscribe((a) => this.onNotificationReceived(a));
    }
    if (this.data) {
      if (this.data.select$) {
        this.data.select$.subscribe(() => {
          this.change = !this.change;
        });
      }
    }
  }
  componentDidLoad() {
    if (this.domrect) {
      const y = this.domrect.y;
      const sharedEl = this.el.shadowRoot.querySelector('ion-item.shared');
      sharedEl.classList.add('animatable');
      const animation = sharedEl.animate(
        [
          { transform: `translate3d(0, ${y - 80}px, 0) scale3d(0.9, 0.9, 1)` },
          { transform: `translate3d(0, 0, 0) scale3d(1, 1, 1)` },
        ],
        {
          duration: 700,
          easing: 'ease-in-out',
        }
      );
      animation.onfinish = () => {
        sharedEl.classList.remove('animatable');
      };
    }
  }

  componentWillRender() {
    this.currIonTextareaEl = null;
  }

  async componentDidRender() {
    this.currIonTextareaEl = this.contentEl.querySelector('ion-textarea');
    if (this.currIonTextareaEl) {
      this.currIonTextareaEl.autoGrow = true;
    }
    // const selectedEl = this.el.shadowRoot.querySelector('.selected');
    // if (selectedEl) {
    //   selectedEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    // }
    // must be done after every render in case new supports are added
    if (this.data.support && this.data.support.length) {
      this.data.support.map((itm) => {
        itm.select$.subscribe(() => {
          this.change = !this.change;
        });
      });
    }
  }

  async onNotificationReceived(a: string) {
    await this.listEl.closeSlidingItems();
    switch (a) {
      case 'external-mod':
        // just for re-render
        this.change = !this.change;
        break;
      default:
    }
  }

  modified(percDiff?: number) {
    this.change = !this.change;
    this.docAction.emit({ action: 'modified', value: percDiff || null });
  }

  reorderItems(ev) {
    const itemMove = this.data.support.splice(ev.detail.from, 1)[0];
    this.data.support.splice(ev.detail.to, 0, itemMove);
    ev.detail.complete(false);
    this.data.logAction(StLogActionEnum.REORDER);
    this.modified();
  }

  async onEditItem(item: SymThink, _conclusion = false) {
    this.itemAction.emit({ action: 'edit', value: item });
  }
  onAddSourceClick() {
    if (this.currIonTextareaEl) {
      return;
    }
    this.itemAction.emit({
      action: 'add-source',
      value: this.data,
    });
  }
  onSupportItemClick(item: SymThink, ev: MouseEvent | PointerEvent): void {
    if (this.currIonTextareaEl) {
      return;
    }
    ev.stopPropagation();
    // get coordinates of item clicked
    if (item.url) {
      window.location.assign(item.url);
    } else if (item.isKidEnabled()) {
      const ionItem = ev
        .composedPath()
        .find(
          (e) => (e as HTMLElement).localName === 'ion-item'
        ) as HTMLElement;
      let domrect = null;
      if (ionItem) {
        domrect = ionItem.getBoundingClientRect();
      }
      this.itemAction.emit({
        action: 'support-clicked',
        value: item,
        domrect,
      });
    } else {
      this.itemAction.emit({ action: 'support-clicked', value: item });
    }

    this.change = !this.change;
  }

  onItemClick(item: SymThink, ev: MouseEvent | PointerEvent): void {
    ev.stopPropagation();
    const el = ev.target as HTMLElement;
    const ionItem = el.closest('ion-item');
    if (ionItem) {
      this.selectedElHeight = ionItem.offsetHeight;
    }
    item.select$.next(true);
  }

  async onRemoveOrTrimItem(item: SymThink) {
    this.itemAction.emit({ action: 'slide-opt-trim', value: item });
  }

  async onExtendItem(item: SymThink) {
    this.itemAction.emit({ action: 'slide-opt-extend', value: item });
  }

  async onItemOptionsClick(item: SymThink, evt?: MouseEvent) {
    if (evt) {
      evt.stopPropagation();
      evt.preventDefault();
    }
    this.itemAction.emit({ action: 'item-opts-clicked', value: item });
  }

  textPh(item: SymThink) {
    const info = CardRules.find((itm) => itm.type === item.type);
    if (info && this.data.selected) {
      return info.placeholder;
    }
    return '';
  }

  supportsPh(item: SymThink) {
    const info = CardRules.find((itm) => itm.type === item.type);
    if (info) {
      return info.supportsPh;
    }
    return '';
  }

  conclPh(item: SymThink) {
    const info = CardRules.find((itm) => itm.type === item.type);
    if (info) {
      return info.conclPh;
    }
    return '';
  }

  onIonContentClick(e: MouseEvent | PointerEvent) {
    // console.log('onIonContentClick', e)
    if (this.data.selected) {
      this.data.select$.next(false);
    } else if (this.data.hasKids()) {
      const el: HTMLElement = e.composedPath().shift() as HTMLElement;
      if (el.localName !== 'textarea') {
        this.data.support.map((sup) => {
          if (sup.selected) {
            sup.select$.next(false);
          }
        });
      }
    }
  }

  renderItemIcon(item: SymThink, num: number) {
    const useConcl =
      this.data.lastSupIsConcl && this.data.support.length === num;
    const label = useConcl ? 'therefore' : this.data.numeric ? num : 'bullet';
    if (item.url) {
      return (
        <div class="bullet-ctr">
          <ion-icon name="open-outline"></ion-icon>
        </div>
      );
    } else if (item.isKidEnabled()) {
      return <d2-icon slot="start" expandable={true} label={label}></d2-icon>;
    } else {
      return <d2-icon slot="start" label={label}></d2-icon>;
    }
  }

  renderItemOptionsBtn(item: SymThink) {
    return (
      <ion-button
        class="opts-btn"
        slot="end"
        fill="solid"
        shape="round"
        onClick={(evt: MouseEvent) => this.onItemOptionsClick(item, evt)}
      >
        <ion-icon slot="icon-only" name="ellipsis-horizontal"></ion-icon>
      </ion-button>
    );
  }

  renderLabel(txt?: string, type = ARG_TYPE.Claim) {
    if (!txt) return null;
    let label;
    if (/^[^:]+:/.test(txt)) {
      let parts = txt.split(':');
      label = parts.shift();
      txt = parts.join(':').trim();
    }
    txt = txt.replace(trailingSympunkRegExp, '');
    let iconCls;
    let cr = CardRules.find((cr) => cr.type === type);
    if (cr) {
      iconCls = cr.iconCls;
    }
    return [
      !!label && <b style={{ 'font-weight': 'bold' }}>{label}:</b>,
      ' ' + txt,
      <span class={iconCls}></span>,
    ];
  }

  renderSupportItems() {
    const isEditable = (itm) =>
      !!(itm.selected && this.canEdit && !itm.isKidEnabled() && !itm.url);
    return (
      <ion-reorder-group
        onIonItemReorder={(e) => this.reorderItems(e)}
        disabled={this.reOrderDisabled}
      >
        {this.data.support.map((item, index) => (
          <ion-item-sliding
            disabled={this.disableSlideOpts(item)}
            key={item.id}
          >
            <ion-item
              id={item.id}
              class={{
                'can-edit': this.canEdit,
                selected: !!item.selected,
                'item-text': true,
              }}
              lines="none"
              onClick={(ev) => this.onSupportItemClick(item, ev)}
              onMouseEnter={(evt: MouseEvent) => {
                const e = evt.target as HTMLElement;
                e.classList.add('item-over');
              }}
              onMouseLeave={(evt: MouseEvent) => {
                const e = evt.target as HTMLElement;
                e.classList.remove('item-over');
              }}
            >
              {this.renderItemIcon(item, index + 1)}
              {isEditable(item) && (
                <ion-textarea
                  onIonInput={(e) => this.onTextareaInput(e, item)}
                  onIonBlur={(e) => this.onTextareaBlur(e, item)}
                  value={item.text}
                  maxlength={250}
                  spellcheck={true}
                  autocapitalize="sentences"
                  autocorrect={'off'}
                  wrap={'soft'}
                  autofocus={true}
                  autoGrow={true}
                  inputmode={'text'}
                  style={{
                    'caret-color': 'currentColor',
                    height: this.selectedElHeight + '',
                  }}
                  placeholder={this.supportsPh(item)}
                ></ion-textarea>
              )}
              {!isEditable(item) && (
                <ion-label
                  style={{ 'max-width': '100%' }}
                  class={{
                    'line-clamp': !this.reOrderDisabled,
                    'ion-text-wrap': this.reOrderDisabled,
                    'single-line': item.singleLine(),
                    placeholder: !item.hasItemText(),
                  }}
                >
                  {this.renderLabel(item.getSupportItemText(), item.type) ||
                    this.textPh(item)}
                  {!!item.concl && <div>{item.concl}</div>}
                  {item.isEvent && <p>{item.eventDate?.toLocaleString()}</p>}
                </ion-label>
              )}
              {this.canEdit && this.renderItemOptionsBtn(item)}
              <ion-reorder slot="end"></ion-reorder>
            </ion-item>
            <ion-item-options
              side="start"
              onIonSwipe={() => this.onExtendItem(item)}
            >
              <ion-item-option
                color="tertiary"
                class="secondary-btn-theme opts-btn-slide"
                onClick={() => this.onItemOptionsClick(item)}
              >
                <ion-icon name="ellipsis-horizontal"></ion-icon>
              </ion-item-option>
              <ion-item-option
                expandable
                class="secondary-btn-theme"
                onClick={() => this.onExtendItem(item)}
              >
                <ion-icon name="arrow-forward-outline"></ion-icon>
              </ion-item-option>
            </ion-item-options>

            <ion-item-options
              side="end"
              onIonSwipe={() => this.onRemoveOrTrimItem(item)}
            >
              <ion-item-option
                expandable
                class="secondary-btn-theme"
                onClick={() => this.onRemoveOrTrimItem(item)}
              >
                <ion-icon name="cut-outline"></ion-icon>
              </ion-item-option>
            </ion-item-options>
          </ion-item-sliding>
        ))}
      </ion-reorder-group>
    );
  }

  onTextareaInput(evt: IonTextareaCustomEvent<InputEvent>, item) {
    evt.stopPropagation();
    evt.preventDefault();
    const ta = evt.target as HTMLIonTextareaElement;
    item.text = ta.value;
    this.docAction.emit({ action: 'modified', value: null });

    // let percDiff = getPercentageDifference(
    //   item.text?.toString() || '',
    //   ta.value.toString()
    // );
    // percDiff = Math.round(percDiff);
    // item.text = ta.value;
    // item.selected = false;
    // if (item.text.length > 5) {
    //   this.modified(percDiff);
    // } else {
    //   this.modified();
    // }
  }

  onTextareaBlur(evt: IonTextareaCustomEvent<any>, item) {
    const ta = evt.target as HTMLIonTextareaElement;
    const typ = CardRules.find((r) => r.type === item.type);
    if (typ && ta && ta.value && ta.value.length) {
      let newVal =
        ta.value
          .replace(/[\r\n\t]+/g, ' ')
          .replace(trailingSympunkRegExp, '')
          .replace(/[\.\!\?]+$/, '') + typ.char;
      const m = newVal.matchAll(/[^\.\!\?]*[\.\!\?]/g);
      let nxt = m.next();
      const sentences = [];
      while (!nxt.done && nxt.value?.length) {
        let tmp: string = nxt.value[0];
        tmp = tmp.trim();
        tmp = tmp.charAt(0).toUpperCase() + tmp.slice(1);
        sentences.push(tmp);
        nxt = m.next();
      }
      item.text = sentences.join(' ');
    }
  }

  renderItems() {
    const isEditable = (itm) => !!(itm.selected && this.canEdit);
    return [
      <ion-item
        id={this.data.id}
        lines="none"
        class={{
          shared: true,
          selected: this.data.selected,
          'can-edit': this.canEdit,
          'top-item': true,
        }}
        onClick={(e) => this.onItemClick(this.data, e)}
      >
        {isEditable(this.data) && (
          <ion-textarea
            onIonInput={(e) => this.onTextareaInput(e, this.data)}
            onIonBlur={(e) => this.onTextareaBlur(e, this.data)}
            value={this.data.getCurrentItemText()}
            maxlength={250}
            spellcheck={true}
            autocapitalize="sentences"
            autocorrect={'off'}
            wrap={'soft'}
            autofocus={true}
            autoGrow={true}
            inputmode={'text'}
            style={{
              'caret-color': 'currentColor',
              height: this.selectedElHeight + '',
            }}
            placeholder={this.textPh(this.data)}
          ></ion-textarea>
        )}
        {!isEditable(this.data) && (
          <ion-label
            style={{ 'max-width': 'unset' }}
            class={{
              'ion-text-wrap': true,
              placeholder: !this.data.hasItemText(),
            }}
          >
            {this.renderLabel(this.data.getCurrentItemText(), this.data.type) ||
              this.textPh(this.data)}
            {this.data.isEvent && (
              <p>
                <b>Date:</b> {this.data.eventDate?.toLocaleString()}
              </p>
            )}
          </ion-label>
        )}
        {/* {this.data.selected && (
      <ion-icon name="create-outline" slot="end"></ion-icon>
    )} */}
      </ion-item>,
      this.data.hasKids() && this.renderSupportItems(),
      this.data.concl && (
        <ion-item
          id={this.data.id + '-concl'}
          class={{ 'can-edit': this.canEdit, selected: this.data.selected }}
          onClick={(e) => this.onItemClick(this.data, e)}
          lines="none"
        >
          <ion-label class="ion-text-wrap">{this.data.concl}</ion-label>
        </ion-item>
      ),
    ];
  }

  renderSourcesBorder() {
    return (
      <div class="sources-border">
        <br />
        <br />
        <div>
          <ion-icon size="large" name="bookmark"></ion-icon>
        </div>
        <hr />
      </div>
    );
  }

  render() {
    return [
      <ion-content
        fullscreen={true}
        ref={(el) => (this.contentEl = el as HTMLIonContentElement)}
        onClick={(e) => this.onIonContentClick(e)}
        class={{
          editing: this.data.selected,
          'sym-text': true,
        }}
      >
        <ion-fab vertical="top" horizontal="start" edge slot="fixed">
          <slot name="fab-top-start"></slot>
        </ion-fab>
        <ion-fab vertical="top" horizontal="end" edge slot="fixed">
          <slot name="fab-top-end"></slot>
        </ion-fab>
        <slot name="card-top"></slot>
        <br />
        <ion-list ref={(el) => (this.listEl = el as HTMLIonListElement)}>
          {this.renderItems()}
        </ion-list>
        <br />
        <slot name="card-list-bottom"></slot>
        {this.renderSourcesBorder()}
        {this.data.hasSources() && [
          <ion-list>
            {this.data.source?.map((md, ix) => (
              <d2-src-metadata
                data={md}
                index={ix}
                canEdit={this.canEdit}
              ></d2-src-metadata>
            ))}
          </ion-list>,
        ]}
        <br />
        <br />
        <br />
        <slot name="card-bottom"></slot>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
      </ion-content>,
    ];
  }
}
