import { Component, Host, h, Prop, Element, Event, EventEmitter, Method } from '@stencil/core';

@Component({
  tag: 'd2-card-btn',
  styleUrl: 'd2-card-btn.scss',
  shadow: true,
})
export class D2CardBtn {
  @Element() el: HTMLElement;

  @Prop() edit: boolean;
  @Prop() dataCount: number;
  @Prop() dataCid: string;
  @Event() linkClicked: EventEmitter<{el: HTMLElement, edit: boolean}>;

  async onClick(evt?: TouchEvent) {
    console.log('card btn click/tap')
    // async onClick(_evt: MouseEvent|TouchEvent) {
      if (this.dataCid === 'newcard' && !this.edit) return;
  
    const container = this.el.closest('.card-content');
    const cardBtnEls = container.querySelectorAll('d2-card-btn');
    cardBtnEls.forEach((node: HTMLElement) => {
      if (node.nodeType === node.ELEMENT_NODE) {
        node.classList.remove('selected');
      }
    });
    this.el.classList.add('selected');
    if (evt) {
      evt.preventDefault();
      evt.stopImmediatePropagation();
    }
    this.linkClicked.emit({el: this.el, edit: !!this.edit});
  }
  isTouchDevice() {
    return (('ontouchstart' in window) ||
      (navigator.maxTouchPoints > 0));
  }

  componentDidRender() {
    // console.log('d2-card-btn componentDidRender()', this.dataCid, this.dataCount);
    // console.debug(this.el.previousSibling)
    // console.debug(/[\n]+[\s]*$/.test(this.el.previousSibling?.textContent));
    // check sibling text for carriage returns
    if (!this.el.previousSibling || this.el.previousSibling.TEXT_NODE &&
      /[\n]+[\s]*$/.test(this.el.previousSibling.textContent)) {
        this.el.classList.add('start');
    }
    else if (!this.el.nextSibling || this.el.nextSibling.TEXT_NODE && 
      /^[\s]*[\n]+/.test(this.el.nextSibling.textContent)) {
        this.el.classList.add('end');
    }
    else {
      this.el.classList.add('middle');
    }
    if (this.isTouchDevice()) {
      this.el.addEventListener('touchstart', (e) => this.onClick(e));
    } else {
      this.el.addEventListener('click', () => this.onClick());
    }

  }

  renderIcon() {
    if (this.edit) {
      if (this.dataCount > 0) {
        return <div>{this.dataCount}</div>;
      } else {
        return <ion-icon name="add"></ion-icon>;
      }
    } else {
      if (this.dataCid === 'newcard') {
        // placeholder
        return <ion-icon></ion-icon>;
      } else {
        return <ion-icon name="chevron-forward"></ion-icon>;
      }
    }
  }

  render() {
    return <Host 
      contentEditable="false" 
      inputmode="none"
      >
        {this.renderIcon()}
    </Host>;
  }
}
