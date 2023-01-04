import { Component, Host, h, Prop, JSX } from '@stencil/core';

@Component({
  tag: 'd2-dialog',
  styleUrl: 'd2-dialog.css',
  shadow: true,
})
export class D2Dialog {
  @Prop() content: JSX.Element;

  render() {
    return (
      <Host>
        {this.content}
      </Host>
    );
  }

}
