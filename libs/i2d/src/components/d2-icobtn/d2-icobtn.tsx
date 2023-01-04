import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'd2-icobtn',
  styleUrl: 'd2-icobtn.css',
  shadow: true,
})
export class D2Icobtn {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
