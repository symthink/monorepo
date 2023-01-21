import { Component, h, Host, Prop, State } from '@stencil/core';
import { FormatEnum, SymThinkDocument } from '../../core/symthink.class';
import { Subject } from 'rxjs';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

@Component({
  tag: 'd2-byline',
  styleUrl: 'd2-byline.scss',
  shadow: true,
})
export class D2Byline {
  /**
   * Symthink Document
   */
  @Prop() symthinkDoc: SymThinkDocument;
  @Prop() created: number|string;
  @Prop() modified: number|string;
  @Prop() displayName: string;

  @Prop() refresh?: Subject<any | void>;
  @State() changed = false;

  componentWillLoad() {
    if (this.refresh) {
      this.refresh.subscribe(() => this.changed = !this.changed);
    }
  }

  renderReviewByLine() {
    const src = this.symthinkDoc.source && this.symthinkDoc.source[0];
    const year = dayjs(this.modified).format('YYYY');
    if (src) {
      return (
        <Host>
          <div class="by-line">
            {this.displayName||'Created'} ({year}). [Symthink&nbsp;of <i>{src.title}</i>, by&nbsp;{src.author}]. {src.publisher}
          </div>
        </Host>
      );
    } else {
      return (
        <Host>
          <div class="by-line">
            {this.displayName||'Created'} ({year}). [Symthink&nbsp;of <i>_Source_</i>, by&nbsp;_Author_]. _Publisher_
          </div>
        </Host>
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
    return (
      <Host>
        <div class="by-line"><i>{author}&nbsp;{createdDate} <br />
        {!!updatedDate && <span>Updated {updatedDate}</span>}</i></div>
      </Host>
    );
  }

  render() {
    if (this.symthinkDoc.format === FormatEnum.Review) {
      return this.renderReviewByLine();
    } else {
      return this.renderDefaultByLine();
    }
  }
}
