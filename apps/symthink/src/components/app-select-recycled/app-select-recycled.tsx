import { Component, h, Prop, Host, State } from '@stencil/core';
import { ISymThink } from '@symthink/i2d';
import { Subject } from 'rxjs';

@Component({
  tag: 'app-select-recycled',
  styleUrl: 'app-select-recycled.scss',
  shadow: false,
})
export class AppSelectRecycled {
  orphans: ISymThink[] = [];
  @Prop() recycleBin: ISymThink[] = [];
  @Prop() recycle$: Subject<{source, id}>;

  @State() change = true;

  componentWillLoad() {
    this.orphans = this.recycleBin.sort((a,b)=>a.expires < b.expires ? 1 : -1);
  }

  action(list: string, id: string) {
    this.recycle$.next({source:list,id});
    setTimeout(()=>{
      this.change = !this.change;
    }, 200);
  }

  renderList() {
    return this.orphans.map((item) => {
      const expireDate = new Date(item.expires);

      return (
        <ion-item lines="full" onClick={() => this.action('recycle', item.id)}>
            <ion-label class="ion-text-wrap">
              {item.text || item.label}
              <p>Expires: {expireDate.toLocaleDateString()} {expireDate.toLocaleTimeString()}</p>
            </ion-label>
        </ion-item>
      );
    });
  }

  render() {
    return (
      <Host>
        <ion-header>
          <ion-toolbar color="light">
            <ion-title>Recycling Bin</ion-title>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding sym-text">
          {this.renderList()}
          {this.recycleBin.length === 0 && 
          [<ion-item lines="none"></ion-item>,
          <ion-item lines="none">
            <ion-label class="empty">Empty</ion-label>  
          </ion-item>]}
        </ion-content>
      </Host>
    );
  }
}
