import { popoverController } from '@ionic/core';
import {
  ActionSheetButton,
  ActionSheetOptions,
} from '@ionic/core/dist/types/components/action-sheet/action-sheet-interface';
import { Component, h, Prop, Element } from '@stencil/core';

/**
 * This component is intended to be a stand-in replacement for an actionSheet but
 * used with a popoverController for non-mobile desktop views
 */
@Component({
  tag: 'd2-select',
  styleUrl: 'd2-select.scss',
  shadow: true,
})
export class D2Select {
  @Element() el: HTMLElement;
  @Prop() options: ActionSheetOptions;

  async onItemClick(button: ActionSheetButton, evt: MouseEvent|PointerEvent) {
    const popover = await popoverController.getTop();
    popover.dismiss(evt, button.role);
  }

  render() {
    return (
      <ion-list>
        {/* <ion-list-header>{this.options.header}</ion-list-header> */}
        {this.options.buttons.map((button: ActionSheetButton, ix, arr) => (
          <ion-item 
            onClick={(evt) => this.onItemClick(button, evt)}
            lines={ix + 1 < arr.length ? 'full' : 'none'}
            onMouseEnter={(evt: MouseEvent) => {
              const e = evt.target as HTMLElement;
              e.classList.add('item-hover');
            }}
            onMouseLeave={(evt: MouseEvent) => {
              const e = evt.target as HTMLElement;
              e.classList.remove('item-hover');
            }}
          >
            <ion-label>{button.text}</ion-label>
            {button.icon && <ion-icon slot="end" name={button.icon}></ion-icon>}
          </ion-item>
        ))}
      </ion-list>
    );
  }
}
