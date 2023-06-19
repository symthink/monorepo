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

  async onItemClick(button: ActionSheetButton, _evt: MouseEvent|PointerEvent) {
    const popover = await popoverController.getTop();
    popover.dismiss(button.data, button.role);
  }

  useSvg(icon: string) {
    return /\.svg$/.test(icon);
  }

  renderIcon(btn: ActionSheetButton) {
    if (btn.icon) {
      if (this.useSvg(btn.icon)) {
        return (<ion-icon color={btn.role==='destructive'?'danger':undefined} slot="end" src={btn.icon}></ion-icon>);
      } else {
        return (<ion-icon color={btn.role==='destructive'?'danger':undefined} slot="end" name={btn.icon}></ion-icon>);
      }
    }
  }

  render() {
    return (
      <ion-list>
        {this.options.header && <ion-list-header>{this.options.header}</ion-list-header>}
        {this.options.buttons.map((button: ActionSheetButton, ix, arr) => (
          <ion-item 
            onClick={(evt) => this.onItemClick(button, evt)}
            lines={ix + 1 < arr.length ? 'full' : 'none'}
          >
            <ion-label color={button.role==='destructive'?'danger':undefined}>{button.text}</ion-label>
            {this.renderIcon(button)}
          </ion-item>
        ))}
      </ion-list>
    );
  }
}
