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
  @Prop() created: number;
  @Prop() modified: number;
  @Prop() displayName: string;

  @Prop() refresh?: Subject<any | void>;
  @State() changed = false;

  componentWillLoad() {
    console.log('d2-byline componentWillLoad');
    console.debug(this.symthinkDoc);
  }

  renderReviewByLine() {
    const src = this.symthinkDoc.source[0];
    if (src) {
      const year = dayjs(this.modified).format('YYYY');
      return (
        <Host class="by-line">
          <div>
            {this.displayName||'Created'} ({year}). [Symthink of <i>{src.title}</i>, by {src.author}]. {src.publisher}
          </div>
        </Host>
      );
    } else {
      return (
        <Host class="by-line">
          <div>No Source</div>
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
      <Host class="by-line">
        <i>{author}&nbsp;{createdDate} <br />
        {!!updatedDate && <span>Updated {updatedDate}</span>}</i>
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
