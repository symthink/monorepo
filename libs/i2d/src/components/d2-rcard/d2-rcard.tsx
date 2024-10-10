import { IonTextareaCustomEvent } from '@ionic/core';
import {
  Component,
  h,
  Prop,
  State,
  Event,
  EventEmitter,
  Element
} from '@stencil/core';
import { Subject } from 'rxjs';
import {
  SymThinkDocument,
  SymThink,
  CardRules,
  StLogActionEnum,
  sympunkReplacementRegex,
  Bullets,
  ARG_TYPE,
  sympunkRegex,
  CitationStyleLang,
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
  @Prop() domrect?: DOMRect;
  // @Prop() reOrderDisabled = true;
  contentEl: HTMLIonContentElement;
  @State() checkboxHidden = true;
  @State() change = false;
  @Event() itemAction: EventEmitter<{
    action;
    value;
    domrect?: DOMRect;
    pointerEvent?: MouseEvent | PointerEvent;
  }>;
  @Event() docAction: EventEmitter<{ action; value }>;

  private listEl: HTMLIonListElement;
  private currIonTextareaEl: HTMLIonTextareaElement;
  private selectedElHeight: number = 50;
  private sourcList: { id: string; index: number; src: CitationStyleLang }[];
  private pressTimer: number | undefined;
  // private logEvt$: Subject<StLogActionEnum> = new Subject();

  get showMoreOptions(): boolean {
    return this.canEdit;
  }

  get reOrderDisabled(): boolean {
    return !this.data.reorder$.value;// if true, re-order is disabled
  }

  isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  disableSlideOpts(itm: SymThink) {
    if (!this.canEdit || !this.isTouchDevice()) return true;
    // else can edit
    return !this.reOrderDisabled || !!(itm.selected && !itm.isKidEnabled());
  }

  componentWillLoad() {
    // console.log('canEdit', this.canEdit);
    if (this.notify) {
      this.notify.subscribe((a) => this.onNotificationReceived(a));
    }
    // trigger rerender on reorder
    this.data.reorder$.subscribe(() => {
      if (this.listEl) {
        this.listEl.closeSlidingItems();
      }
      this.change = !this.change;
    });
    if (this.data) {
      if (this.data.select$) {
        this.data.select$.subscribe(() => (this.change = !this.change));
      }
      if (this.data.mod$) {
        this.data.mod$.subscribe(() => {
          console.log('st mod$ triggered')
          this.sourcList = this.data.getShowableSources();
          this.change = !this.change;
        });
      }
      this.sourcList = this.data.getShowableSources();
      this.data.getRoot().log$.subscribe((a: { action: StLogActionEnum, ts: number }) => {
        if (a.action === StLogActionEnum.ADD_SOURCE) {
          console.log('ADD_SOURCE event received in rcard, trigger re-render')
          this.sourcList = this.data.getShowableSources();
          this.change = !this.change;
        }
      });
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
    if (this.currIonTextareaEl) {
      console.log('remove ion-textarea handlers');
      this.currIonTextareaEl.removeEventListener('touchstart', this.handleTouchStart);
      this.currIonTextareaEl.removeEventListener('touchend', this.handleTouchEnd);
      this.currIonTextareaEl.removeEventListener('contextmenu', this.preventDefault);
      this.currIonTextareaEl = null;
    }
  }

  preventDefault(e: TouchEvent) {
    e.preventDefault();
    e.stopPropagation();
  }

  async componentDidRender() {
    this.currIonTextareaEl = this.contentEl.querySelector('ion-textarea');
    if (this.currIonTextareaEl) {
      this.currIonTextareaEl.autoGrow = true;
      this.currIonTextareaEl.addEventListener('touchstart', this.handleTouchStart, { passive: true });
      this.currIonTextareaEl.addEventListener('touchend', this.handleTouchEnd, { passive: true });
      const ta = this.currIonTextareaEl.querySelector('textarea');
      if (ta) {
        ta.addEventListener('contextmenu', (e) => e.preventDefault());
      }
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
      this.itemAction.emit({ action: 'subcription-clicked', value: item.url });
      // window.location.assign(item.url);
    } else if (item.isKidEnabled()) {
      const ionItem = ev
        .composedPath()
        .find(
          (e) => (e as HTMLElement).localName === 'ion-item'
        ) as HTMLElement;
      let domrect = null;
      if (ionItem) {
        domrect = ionItem.getBoundingClientRect();
        ionItem.classList.remove('item-over');
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
      ionItem.classList.remove('item-over');
    }
    item.select$.next(true);
    if (!this.data.isRoot && !this.canEdit) {
      this.docAction.emit({
        action: 'go-back',
        value: item,
      });
    }
  }

  async onRemoveOrTrimItem(item: SymThink) {
    this.itemAction.emit({ action: 'slide-opt-trim', value: item });
  }

  async toggleLock(item: SymThink) {
    if (item.private) {
      delete item.private;
    } else {
      item.private = true;
    }
    this.docAction.emit({ action: 'modified', value: null });
    if (this.listEl) {
      this.listEl.closeSlidingItems();
    }
    this.modified();
  }

  async onExtendItem(item: SymThink) {
    this.itemAction.emit({ action: 'slide-opt-extend', value: item });
  }

  async onItemOptionsClick(item: SymThink, evt?: MouseEvent | PointerEvent) {
    if (evt) {
      evt.stopPropagation();
      evt.preventDefault();
    }
    this.itemAction.emit({
      action: 'item-opts-clicked',
      value: item,
      pointerEvent: evt,
    });
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
      return info.placeholder;
      // return info.supportsPh;
    }
    return '';
  }

  conclPh(item: SymThink) {
    const info = CardRules.find((itm) => itm.type === item.type);
    if (info) {
      return info.placeholder;
      // return info.conclPh;
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
    const x = this.data.numeric ? num : 0;
    const bullet = Bullets.find((b) => b.x === x);
    const charLabel = item.isKidEnabled() ? bullet.full : bullet.circ;
    let classList = {
      bullet: true,
      'bullet-full': item.isKidEnabled() && !this.data.numeric,
      'bullet-hollow': !item.isKidEnabled() && !this.data.numeric,
      numbull: this.data.numeric,
    };

    return (
      <span slot="start" class={classList}>
        {charLabel}
        {!!item.private && <span class="locked" />}
      </span>
    );
    // return <d2-icon slot="start" label={label}></d2-icon>;
  }

  renderItemOptionsBtn(item: SymThink) {
    return (
      <ion-button
        class="opts-btn"
        slot="end"
        fill="solid"
        onClick={(evt: MouseEvent) => this.onItemOptionsClick(item, evt)}
      >
        <ion-icon slot="icon-only" name="ellipsis-horizontal"></ion-icon>
      </ion-button>
    );
  }

  renderLabel(txt?: string) {
    if (!txt) return null;
    let label;
    if (/^[^:]+:/.test(txt)) {
      let parts = txt.split(':');
      label = parts.shift();
      txt = parts.join(':').trim();
    }
    return [
      !!label && <b style={{ 'font-weight': 'bold' }}>{label}:</b>,
      ' ' + txt,
    ];
  }

  renderSubscrLine(itm: SymThink) {
    let place = 'Municipality';
    let titleCase = (s: string) =>
      s.replace(/\w\S*/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
    if (itm.url?.host === 'collection.fs') {
      //  /levels/metadata/administrativeArea2/country=us-state=md-county=montgomery/symthink/jHlYkxo4VBXPdNVlqliF
      try {
        const p = itm.url.pathname.split('/');
        p.pop();
        p.pop();
        const a = p.pop();
        const b = a.split('-').pop();
        const c = b.split('=');
        if (c.length === 2) {
          place = titleCase(c[0]) + ': ' + titleCase(c[1]);
        }
      } catch (e) {
        console.warn(e);
      }
    }
    return (
      <div>
        <ion-icon
          size="small"
          color="primary"
          name="notifications-outline"
        ></ion-icon>
        &nbsp;5 days left&nbsp;
        <ion-icon size="small" color="primary" name="earth-outline"></ion-icon>
        &nbsp;{place}
      </div>
    );
  }

  renderSupportItems() {
    const isConcl = (num: number) =>
      this.data.lastSupIsConcl && this.data.support.length === num;
    const isEditable = (itm: SymThink) =>
      !!(itm.selected && this.canEdit && !itm.isKidEnabled() && !itm.url);
    let supSrcList = this.data.support.map((sup) => {
      if (sup.hasSources()) {
        return this.sourcList.reduce((acc, curr, i) => {
          if (curr.id === sup.id) acc.push(i + 1);
          return acc;
        }, []);
      } else {
        return null;
      }
    });
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
                selected: !!item.selected && this.canEdit,
                'item-text': !isConcl(index + 1),
                'item-concl': isConcl(index + 1),
              }}
              lines="none"
              onClick={(ev) => this.onSupportItemClick(item, ev)}
              onMouseEnter={(evt: MouseEvent) => {
                const e = evt.target as HTMLElement;
                if (!item.selected && this.reOrderDisabled) {
                  e.classList.add('item-over');
                }
              }}
              onMouseLeave={(evt: MouseEvent) => {
                const e = evt.target as HTMLElement;
                e.classList.remove('item-over');
              }}
            >
              {!isConcl(index + 1) && this.renderItemIcon(item, index + 1)}
              {isEditable(item) && (
                <ion-textarea id={item.id}
                  onIonInput={(e) => this.onTextareaInput(e, item)}
                  onIonBlur={(e) => this.onTextareaBlur(e, item)}
                  onKeyUp={(e) => this.onKeyUp(e)}
                  value={item.text}
                  maxlength={280}
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
                  enterkeyhint="done"
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
                  {this.renderLabel(item.getSupportItemText()) ||
                    this.textPh(item)}
                  {item.isEvent && <p>{item.eventDate?.toLocaleString()}</p>}
                  {!!item.url && this.renderSubscrLine(item)}
                  {(!!supSrcList[index] && !!supSrcList[index].length) && (
                    <p class="item-subscript">
                      <ion-icon name="bookmark" size="small"></ion-icon>&nbsp;{supSrcList[index].join(',')}
                    </p>
                  )}
                </ion-label>
              )}
              {this.canEdit && this.renderItemOptionsBtn(item)}
              <ion-reorder slot="end"></ion-reorder>
            </ion-item>
            {!item.hasKids() &&
              <ion-item-options
                side="start"
                onIonSwipe={() => this.onExtendItem(item)}
              >
                <ion-item-option
                  expandable
                  class="secondary-btn-theme"
                  onClick={() => this.onExtendItem(item)}
                >
                  <ion-icon name="arrow-forward-outline"></ion-icon>
                </ion-item-option>
              </ion-item-options>
            }
            <ion-item-options
              side="end"
              onIonSwipe={() => this.onRemoveOrTrimItem(item)}
            >
              <ion-item-option color="tertiary"
                onClick={() => this.toggleLock(item)}
              >
                <ion-icon name={`lock-${item.private ? 'open' : 'closed'}-outline`}></ion-icon>
              </ion-item-option>
              <ion-item-option
                expandable color="danger"
                onClick={() => this.onRemoveOrTrimItem(item)}
              >
                <ion-icon name="trash-outline"></ion-icon>
              </ion-item-option>

            </ion-item-options>
          </ion-item-sliding>
        ))}
      </ion-reorder-group>
    );
  }

  onKeyUp(evt: KeyboardEvent, type?: string) {
    console.log('onKeyUp handler', evt.key, type)
    if (evt.key === 'Enter') {
      evt.stopPropagation();
      evt.preventDefault();
      let nextItem: SymThink;
      if (type === 'top') {
        // if has child items, then focus on first child item
        if (this.data.hasKids()) {
          nextItem = this.data.support[0];
        }
        else {
          if (!this.data.isKidEnabled()) {
            this.data.enableKids();
          }
          nextItem = this.data.addChild({ type: ARG_TYPE.Statement });
        }
      } else {
        // if has next sibling, then focus on next sibling
        const idx = this.data.support.findIndex((i) => i.selected);
        if (idx === -1) {
          console.log('no selected item found')
          return;
        }
        if (this.data.support[idx + 1]) {
          nextItem = this.data.support[idx + 1];
        } else {
          // if no next sibling, then make next sibling and focus on it
          nextItem = this.data.addChild({ type: ARG_TYPE.Statement });
        }
      }
      if (nextItem) {
        nextItem.select$.next(true);
      }
      this.change = !this.change;
      return;
    }
  }

  onTextareaInput(evt: IonTextareaCustomEvent<InputEvent>, item) {
    evt.stopPropagation();
    evt.preventDefault();
    const ta = evt.target as HTMLIonTextareaElement;
    let newVal = ta.value.trim();
    if (!sympunkRegex.test(newVal)) {
      // no sympunk found, check for regular punctuation
      for (let cardType of CardRules) {
        if (cardType.swap && cardType.swap.test(newVal)) {
          newVal = newVal.replace(cardType.swap, cardType.char);
          item.type = cardType.type;
          break;
        }
      }
    }
    item.text = ta.value;
    this.docAction.emit({ action: 'modified', value: null });
  }

  onTextareaBlur(evt: IonTextareaCustomEvent<any>, item) {
    const ta = evt.target as HTMLIonTextareaElement;
    const typ = CardRules.find((r) => r.type === item.type);
    if (typ && ta && ta.value && ta.value.length) {
      let newVal = ta.value.trim();
      if (!sympunkRegex.test(newVal)) {
        // no sympunk found, check for regular punctuation
        for (let cardType of CardRules) {
          if (cardType.swap && cardType.swap.test(newVal)) {
            newVal = newVal.replace(cardType.swap, cardType.char);
            item.type = cardType.type;
            break;
          }
        }
      }

      // capitalize first letter of each sentence
      let match;
      const sentences = [];
      while ((match = sympunkReplacementRegex.exec(newVal)) !== null) {
        let tmp: string = match[0];
        tmp = tmp.trim();
        tmp = tmp.charAt(0).toUpperCase() + tmp.slice(1);
        sentences.push(tmp);
      }
      item.text = sentences.length ? sentences.join(' ').trim() : newVal;
      this.change = !this.change;
    }
  }

  handleTouchStart = (_e: TouchEvent) => {
    if (this.currIonTextareaEl) {
      this.currIonTextareaEl.blur();
    }
    this.pressTimer = window.setTimeout(() => {
      console.log('LongPressed:', this.currIonTextareaEl.id);
      const item = this.data.find((i) => i.id === this.currIonTextareaEl.id);
      if (item) {
        this.itemAction.emit({ action: 'edit-full', value: item });
      }
    }, 600);
  };
  handleTouchEnd = (_e: TouchEvent) => {
    if (this.pressTimer) {
      clearTimeout(this.pressTimer);
    }
  };

  renderItems() {
    const isEditable = (itm) => !!(itm.selected && this.canEdit);
    const srcListX = this.sourcList.reduce((acc, curr, i) => {
      if (curr.id === this.data.id) acc.push(i + 1);
      return acc;
    }, []);
    return [
      <ion-item-sliding
        disabled={this.disableSlideOpts(this.data)}
        key={this.data.id}
      >
        <ion-item
          id={this.data.id}
          lines="none"
          class={{
            shared: true,
            selected: this.data.selected && this.canEdit,
            'can-edit': this.canEdit,
            'top-item': true,
          }}
          onClick={(e) => this.onItemClick(this.data, e)}
          onMouseEnter={(evt: MouseEvent) => {
            const e = evt.target as HTMLElement;
            if (this.canEdit && !this.data.selected) {
              e.classList.add('item-over');
            }
          }}
          onMouseLeave={(evt: MouseEvent) => {
            const e = evt.target as HTMLElement;
            e.classList.remove('item-over');
          }}
        >
          {isEditable(this.data) && (
            <ion-textarea id={this.data.id}
              onIonInput={(e) => this.onTextareaInput(e, this.data)}
              onIonBlur={(e) => this.onTextareaBlur(e, this.data)}
              onKeyUp={(e) => this.onKeyUp(e, 'top')}
              value={this.data.getCurrentItemText()}
              maxlength={280}
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
              enterkeyhint="done"
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
              {this.renderLabel(this.data.getCurrentItemText()) ||
                this.textPh(this.data)}
              {this.data.isEvent && (
                <p>
                  <b>Date:</b> {this.data.eventDate?.toLocaleString()}
                </p>
              )}
              {!!srcListX.length && (
                <p class="item-subscript">
                  <ion-icon name="bookmark" size="small"></ion-icon>&nbsp;{srcListX.join(',')}
                </p>
              )}
            </ion-label>
          )}
          {/* {this.data.selected && (
      <ion-icon name="create-outline" slot="end"></ion-icon>
    )} */}
          {this.canEdit && this.renderItemOptionsBtn(this.data)}
        </ion-item>
        <ion-item-options side="end">
          <ion-item-option
            color="tertiary"
            class="secondary-btn-theme opts-btn-slide"
            onClick={(e) => this.onItemOptionsClick(this.data, e)}
          >
            <ion-icon name="ellipsis-horizontal"></ion-icon>
          </ion-item-option>
        </ion-item-options>
      </ion-item-sliding>,
      this.data.hasKids() && this.renderSupportItems(),
    ];
  }

  renderSources() {
    console.log('renderSources()', this.sourcList)
    return [
      !this.canEdit && <div class="sources-border">
        <div>§</div>
      </div>,
      <ion-list>
        {this.sourcList?.map((md, ix) => (
          <d2-src-metadata
            data={md.src}
            stid={md.id}
            listNo={ix + 1}
            index={md.index}
            canEdit={this.canEdit}
          ></d2-src-metadata>
        ))}
      </ion-list>
    ];
  }

  render() {
    return [
      <ion-content scrollEvents={true} onIonScroll={(e) => this.docAction.emit({ action: 'scroll', value: e.detail.currentY })}
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
        {!this.data.isRoot && !this.canEdit && <div class="back-arrow">⟵</div>}

        <ion-list ref={(el) => (this.listEl = el as HTMLIonListElement)}>
          {this.renderItems()}
        </ion-list>
        <slot name="card-list-bottom"></slot>

        {this.canEdit && !this.data.isRoot && <div class="sources-border">
          <div>§</div>
        </div>}

        {!!this.sourcList?.length && this.renderSources()}
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
