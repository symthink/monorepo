import { Component, h, Element, Prop, Watch } from '@stencil/core';
import { TagRegEx } from '../../core/argument.class';
import { IArgument } from '../../core/interfaces';

@Component({
  tag: 'd2-card',
  styleUrl: 'd2-card.scss',
  shadow: true,
})
export class D2Card {
  @Element() el: HTMLElement;

  private _card: IArgument;
  @Prop() card: IArgument|string;

  // @Event() linkClicked: EventEmitter<string>;

  private claim: string;
  private support: string;
  private conclusion: string;
  private linkCounter = 1;
  private url: URL;
  private empty: boolean;

  @Watch('card')
  cardWatcher(newValue: IArgument|string) {
    if (typeof newValue === 'string') {
      this._card = JSON.parse(newValue);
    }
    else {
      this._card = newValue;
    }
  }

  componentWillLoad() {
    // console.log('d2-card componentWillLoad()', this.card);
    this.cardWatcher(this.card);
    this.claim = this.swap(this._card.text[0]?.p || '');
    this.support = this.swap(this._card.text[1]?.p || '');
    this.conclusion = this.swap(this._card.text[2]?.p || '');
    this.empty = !!!(this.claim + this.support + this.conclusion).trim().length;
    this.linkCounter = 1;
    this.url = new URL(window.location.href);
  }

  componentShouldUpdate(_newVal, _oldVal, propName){
    if (propName === 'card') {
      return true;
    }
  }

  swap(txt: string) {
    if (txt) {
      txt = txt.trim().split('\n').map(s => 
        s.trim().replace(TagRegEx.cardId, (_m, id)=>`<d2-card-btn data-cid="${id}"></d2-card-btn>`)
      ).join('\n');
    }
    return txt;
  }

  render() {
    return [
    <ion-toolbar>
      <ion-item lines="none">
        <ion-icon name="navigate-outline" slot="start"></ion-icon>
      </ion-item>
    </ion-toolbar>,
    <div class="card-content">
      {this.empty && <div class="empty-card">Empty</div>}
      <p part="card-p" class="card-text" innerHTML={this.claim}></p>
      <p part="card-p" class="card-text" innerHTML={this.support}></p>
      <p part="card-p" class="card-text" innerHTML={this.conclusion}></p>
      <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
    </div>];
  }
}
