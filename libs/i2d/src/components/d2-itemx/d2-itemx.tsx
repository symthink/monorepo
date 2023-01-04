import { Component, h, Prop, State } from '@stencil/core';

@Component({
  tag: 'd2-itemx',
  styleUrl: 'd2-itemx.css'
})
export class D2Itemx {
  @State() detailHidden = true;
  @Prop() name: string;
  @Prop() value: any;
  @Prop() detail = true;

  render() {
    return [
      <ion-item lines="none" detail={this.detail} detailIcon={this.detailHidden ? 'chevron-back': 'chevron-down'} onClick={() => this.detailHidden = !this.detailHidden}>
        <ion-label>{this.name}</ion-label>
        <ion-text>{this.value}&nbsp;</ion-text>
      </ion-item>,
      <ion-item lines="full" hidden={this.detailHidden}>
        <ion-label class="ion-text-wrap"><slot></slot></ion-label>
      </ion-item>
    ];
  }

}
