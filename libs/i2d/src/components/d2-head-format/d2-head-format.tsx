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
  @Event() docAction: EventEmitter<{
    action;
    value;
    pointerEvent?: MouseEvent | PointerEvent;
  }>;

  componentWillLoad() {
    if (this.refresh) {
      this.refresh.subscribe(() => (this.changed = !this.changed));
    }
  }

  onTitleChange(e: CustomEvent) {
    this.symthinkDoc.label = e.detail.value;
    this.docAction.emit({
      action: 'doc-title-change',
      value: null
    });
  }

  renderReviewByLine() {
    const src = this.symthinkDoc.source && this.symthinkDoc.source[0];
    const year = dayjs(this.created).format('YYYY');
    if (src) {
      return (
        <div>
          {this.displayName || 'Created'} ({year}). [Symthink&nbsp;of{' '}
          <i>{src.title}</i>, by&nbsp;{src.author}]. {src.publisher}
        </div>
      );
    } else {
      return (
        <div>
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
      <div>
        <i>
          {author} {createdDate}
        </i>
      </div>,
      <div>
        {!!updatedDate && <i>Updated {updatedDate}</i>}
        {!updatedDate && <i>No updates yet</i>}
      </div>,
    ];
  }

  renderByLine() {
    if (this.symthinkDoc.format === FormatEnum.Review) {
      return <div class="flx-row">{this.renderReviewByLine()}</div>;
    } else {
      return <div class="flx-row">{this.renderDefaultByLine()}</div>;
    }
  }

  render() {
    return [
      <ion-list>
        {/* <ion-item lines="none" class="ion-text-center doc-title">
          {!this.canEdit && (
            <div class={{ invisible: !!!this.symthinkDoc.label }}>
              <h1>{this.symthinkDoc.label}</h1>
            </div>
          )}
          {this.canEdit && (
            <ion-input debounce="400" onIonChange={(e) => this.onTitleChange(e)}
              placeholder="Enter title"
              value={this.symthinkDoc.label}
            ></ion-input>
          )}
        </ion-item> */}

        <ion-item
          lines="none"
          class={{ 'by-line': true, 'got-title': false }}
        >
          {this.renderByLine()}
        </ion-item>
      </ion-list>,

      this.symthinkDoc.format !== FormatEnum.Review && (
        <d2-metrics
          symthinkDoc={this.symthinkDoc}
          refresh={this.refresh}
          modalClassName="modal-sheet sym-text"
        />
      ),
    ];
  }
}
