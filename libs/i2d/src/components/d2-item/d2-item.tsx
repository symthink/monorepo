import { Component, h, Prop, Host } from '@stencil/core';

@Component({
  tag: 'd2-item',
  styleUrl: 'd2-item.scss',
  shadow: false,
})
export class D2Item {

  @Prop() label: string;

  render() {
    return <Host>
    <ion-item-sliding>
      <ion-item lines="full">
        <ion-label>
          <slot></slot>
        </ion-label>
        <ion-reorder slot="end"></ion-reorder>
      </ion-item>
      <ion-item-options side="start">
        <ion-item-option>Edit</ion-item-option>
        <ion-item-option color="danger">Delete</ion-item-option>
      </ion-item-options>
    </ion-item-sliding>
    </Host>;
  }
}
