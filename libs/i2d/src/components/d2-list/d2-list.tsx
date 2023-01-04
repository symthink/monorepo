import { Component, h, Prop, Host, Event, EventEmitter } from '@stencil/core';

@Component({
  tag: 'd2-list',
  styleUrl: 'd2-list.scss',
  shadow: true,
})
export class D2List {

  @Event() reorder: EventEmitter;

  @Prop() edit: boolean = false;

  render() {
    return (
      <Host>
        <ion-list>
          <ion-reorder-group
            ionItemReorder={(e) => this.reorder.emit(e)}
            disabled={this.edit}
          ><slot></slot></ion-reorder-group>
        </ion-list>
      </Host>
    );
  }
}
