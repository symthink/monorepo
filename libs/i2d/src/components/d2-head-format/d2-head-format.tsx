import { Component, h, Prop, State } from '@stencil/core';
import { Subject } from 'rxjs';
import { FormatEnum, SymThinkDocument } from '../../core/symthink.class';

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

  render() {
    return [
      <div
        class={{ 'doc-title': true, invisible: !!!this.symthinkDoc.label }}
      >
        <h1>{this.symthinkDoc.label}</h1>
      </div>,
      <d2-byline
        symthinkDoc={this.symthinkDoc}
        created={this.created}
        modified={this.modified}
        displayName={this.displayName}
      />,
      this.symthinkDoc.format !== FormatEnum.Review && 
      <d2-metrics
        symthinkDoc={this.symthinkDoc}
        modalClassName="modal-sheet sym-text"
      />,
    ];
  }
}
