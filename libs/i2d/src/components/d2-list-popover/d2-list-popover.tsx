import { Component, h, Prop } from '@stencil/core';
import { popoverController } from '@ionic/core';
import { Subject } from 'rxjs';

export interface IPopoverListItem {
  index: number;
  text: string;
}

@Component({
  tag: 'd2-list-popover',
  styleUrl: 'd2-list-popover.scss',
  shadow: false,
})
export class D2ListPopover {
  @Prop() breadcrumbTrail: IPopoverListItem[] = [];
  // @Prop() ionNav: HTMLIonNavElement;
  @Prop() select$: Subject<number>;

  componentWillLoad() {
  }

  navTo(breadcrumb) {
    this.select$.next(breadcrumb.index);
    popoverController.dismiss();
  }
  onExitClick(): void {
    this.select$.next(-1);
    popoverController.dismiss();
  }
  render() {
    let indent = 0;
    return [
      <ion-content>
        <ion-list>
          {this.breadcrumbTrail.map((breadcrumb) => (
            <ion-item onClick={() => this.navTo(breadcrumb)}>
              {breadcrumb.index === 1 && (
                <ion-text class="icon-slot-start" slot="start">&#x022A2;</ion-text>
              )}
              {breadcrumb.index > 1 && (
                <svg slot="start"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-arrow-return-right icon-slot-start"
                  style={{'--padding-start': `${8+(indent++)}px`}}
                  viewBox="0 0 16 16"
                >
                  <path
                    fill-rule="evenodd"
                    d="M1.5 1.5A.5.5 0 0 0 1 2v4.8a2.5 2.5 0 0 0 2.5 2.5h9.793l-3.347 3.346a.5.5 0 0 0 .708.708l4.2-4.2a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 8.3H3.5A1.5 1.5 0 0 1 2 6.8V2a.5.5 0 0 0-.5-.5z"
                  />
                </svg>
              )}
              <ion-label class="ion-text-wrap">{breadcrumb.text}</ion-label>
            </ion-item>
          ))}
          <ion-item lines="none" onClick={() => this.onExitClick()}>
            <ion-icon name="close" slot="start"></ion-icon>
            <ion-label>Close</ion-label>
          </ion-item>
        </ion-list>
      </ion-content>,
    ];
  }
}
