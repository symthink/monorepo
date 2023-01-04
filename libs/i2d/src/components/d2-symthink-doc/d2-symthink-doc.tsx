import { Component, h, Prop, EventEmitter, Event } from '@stencil/core';
import { SymThink } from '../../core/symthink.class';

@Component({
  tag: 'd2-symthink-doc',
  styleUrl: 'd2-symthink-doc.scss',
  shadow: true,
})
export class D2SymthinkDoc {
  @Prop() data: SymThink;

  @Event() docAction: EventEmitter<{ action; value }>;

  componentWillLoad() {
    console.log('d2-symthink-doc componentWillLoad()', this.data);
  }

  onBack() {
    this.docAction.emit({
      action: 'back',
      value: null,
    });
  }

  onSelect() {
    this.docAction.emit({
      action: 'select',
      value: this.data,
    });
  }

  onCancel() {
    this.docAction.emit({
      action: 'cancel',
      value: null,
    });
  }

  render() {
    return [
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-button onClick={() => this.onBack()}>
              <ion-icon name="chevron-back-outline" slot="start"></ion-icon>
              <ion-label>Back</ion-label>
            </ion-button>
          </ion-buttons>
          <ion-buttons slot="end">
            <ion-button onClick={() => this.onCancel()}>
              <ion-label>Cancel</ion-label>
            </ion-button>
            <div class="separator">|</div>
            <ion-button onClick={() => this.onSelect()}>
              <ion-label>Select</ion-label>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>,
      <d2-rcard data={this.data}></d2-rcard>,
    ];
  }
}
