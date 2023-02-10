import { Component, Event, EventEmitter, h, Prop, State } from '@stencil/core';
import { Subject } from 'rxjs';
import { FormatEnum, SymThinkDocument } from '../../core/symthink.class';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

@Component({
  tag: 'd2-head-format',
  styleUrl: 'd2-head-format.scss',
  shadow: true,
})
export class D2HeadFormat {
  /**
   * Symthink Document
   */
  @Prop() symthinkDoc: SymThinkDocument;
  @Prop() created: number | string;
  @Prop() modified: number | string;
  @Prop() displayName: string;
  @Prop() canEdit = false;
  @Prop() refresh?: Subject<any | void>;
  @State() changed = false;
  @Event() itemAction: EventEmitter<{
    action;
    value;
    pointerEvent?: MouseEvent | PointerEvent;
  }>;

  componentWillLoad() {
    if (this.refresh) {
      this.refresh.subscribe(() => (this.changed = !this.changed));
    }
  }

  isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  async onItemOptionsClick(evt?: MouseEvent | PointerEvent) {
    if (evt) {
      evt.stopPropagation();
      evt.preventDefault();
    }
    this.itemAction.emit({
      action: 'item-head-opts-clicked',
      value: null,
      pointerEvent: evt,
    });
  }

  renderItemOptionsBtn() {
    return (
      <ion-button
        class="opts-btn"
        slot="end"
        fill="solid"
        onClick={(evt: MouseEvent) => this.onItemOptionsClick(evt)}
      >
        <ion-icon slot="icon-only" name="ellipsis-horizontal"></ion-icon>
      </ion-button>
    );
  }

  renderReviewByLine() {
    const src = this.symthinkDoc.source && this.symthinkDoc.source[0];
    const year = dayjs(this.modified).format('YYYY');
    if (src) {
      return (
        <div class="by-line">
          {this.displayName || 'Created'} ({year}). [Symthink&nbsp;of{' '}
          <i>{src.title}</i>, by&nbsp;{src.author}]. {src.publisher}
        </div>
      );
    } else {
      return (
        <div class="by-line">
          {this.displayName || 'Created'} ({year}). [Symthink&nbsp;of{' '}
          <i>_Source_</i>, by&nbsp;_Author_]. _Publisher_
        </div>
      );
    }
  }

  renderDefaultByLine() {
    const createdDate = dayjs(this.created).format('MMMM D, YYYY');
    let updatedDate = null;
    if (this.modified && this.modified !== this.created) {
      updatedDate = dayjs(this.modified).fromNow();
    }
    let author = this.displayName ? `By ${this.displayName} on` : 'Created';

    return [
      <div class="by-line" slot="start">
        <i>
          {author}&nbsp;{createdDate}
        </i>
      </div>,
      <div class="by-line" slot="end">
        <i>{!!updatedDate && <span>Updated {updatedDate}</span>}</i>
      </div>,
    ];
  }

  renderByLine() {
    if (this.symthinkDoc.format === FormatEnum.Review) {
      return this.renderReviewByLine();
    } else {
      return this.renderDefaultByLine();
    }
  }

  render() {
    return [
      this.canEdit && (
        <ion-list
          onMouseEnter={(evt: MouseEvent) => {
            const e = evt.target as HTMLElement;
            e.classList.add('item-over');
          }}
          onMouseLeave={(evt: MouseEvent) => {
            const e = evt.target as HTMLElement;
            e.classList.remove('item-over');
          }}
        >
          <ion-item lines="none" class="ion-text-wrap doc-title">
            <div class={{ invisible: !!!this.symthinkDoc.label }}>
              <h1>{this.symthinkDoc.label}</h1>
            </div>
          </ion-item>
          <ion-item-sliding disabled={!this.isTouchDevice()}>
            <ion-item lines="none" class="ion-text-wrap by-line">
              {this.renderByLine()}
            </ion-item>
            <ion-item-options side="end">
              <ion-item-option
                color="tertiary"
                class="secondary-btn-theme opts-btn-slide"
                onClick={() => this.onItemOptionsClick()}
              >
                <ion-icon name="ellipsis-horizontal"></ion-icon>
              </ion-item-option>
            </ion-item-options>
          </ion-item-sliding>
          {this.renderItemOptionsBtn()}
        </ion-list>
      ),
      !this.canEdit && (
        <ion-list>
          <ion-item lines="none" class="ion-text-wrap doc-title">
            <div class={{ invisible: !!!this.symthinkDoc.label }}>
              <h1>{this.symthinkDoc.label}</h1>
            </div>
          </ion-item>
          <ion-item lines="none" class="ion-text-wrap by-line">
            {this.renderByLine()}
          </ion-item>
        </ion-list>
      ),
      this.symthinkDoc.format !== FormatEnum.Review && (
        <d2-metrics
          symthinkDoc={this.symthinkDoc}
          modalClassName="modal-sheet sym-text"
        />
      ),
    ];
  }
}
