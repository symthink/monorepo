import { Component, h, Prop, Event, EventEmitter } from '@stencil/core';
import { ISource } from '../../core/symthink.class';
import dayjs from 'dayjs';

@Component({
  tag: 'd2-src-metadata',
  styleUrl: 'd2-src-metadata.scss',
  shadow: true,
})
export class D2SrcMetadata {
  @Prop() data: ISource;
  @Prop() index: number;
  @Prop() canEdit = false;

  @Event() itemAction: EventEmitter<{ action; value }>;

  onSourceClick() {
    window.open(this.data.url, '_blank');
  }

  onDeleteClick() {
    this.itemAction.emit({action: 'delete-source', value: this.index})
  }

  renderLabel() {
    return (
      <ion-label class="ion-text-wrap">
      <h2>{this.data.title}</h2>
      {this.data.author && <p>By {this.data.author}
      {this.data.date && [ ' on ',
        dayjs(this.data.date).format('MMM D, YYYY')
      ]}
      </p>}
      {this.data.publisher && <p>Publisher: {this.data.publisher}</p>}
      {this.data.description && <p>{this.data.description}</p>}
    </ion-label>
    );
  }

  render() {
    if (this.canEdit) {
      return (
        <ion-item-sliding>
          <ion-item class="align-icon-start"
            onClick={() => this.onSourceClick()}
          >
            {this.renderLabel()}
            <ion-icon slot="end"
                size="small"
                name="open-outline"
              ></ion-icon>
          </ion-item>
          <ion-item-options side="end" onIonSwipe={() => this.onDeleteClick()}>
            <ion-item-option color="danger" expandable onClick={() => this.onDeleteClick()}>
              <ion-icon
                size="large"
                name="trash-outline"
              ></ion-icon>
            </ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      );
    } else {
      return (
        <ion-item class="align-icon-start" detail detailIcon="open-outline" onClick={() => this.onSourceClick()}>
          {this.renderLabel()}
        </ion-item>
      );
    }
  }
}
