import { Component, Event, EventEmitter, h, Prop, Host } from '@stencil/core';
import { FormatEnum, SymThink, SymThinkDocument } from '@symthink/i2d';
import { AppSvc } from '../../global/app.service';

@Component({
  tag: 'app-doc',
  styleUrl: 'app-doc.scss',
  shadow: false,
})
export class AppDoc {
  @Prop() data: SymThink;
  @Prop() level: number;

  @Event() docAction: EventEmitter<{ action; value }>;

  symthinkDoc: SymThinkDocument;

  get depth(): number {
    const { dep } = this.symthinkDoc.getDepth();
    return dep;
  }

  componentWillLoad() {
    if (this.data) {
      this.symthinkDoc = this.data.getRoot() as SymThinkDocument;
    }
  }

  showTouchBack(): boolean {
    return this.isTouchDevice() && this.level > 0;
  }

  showClickBack(): boolean {
    return !this.isTouchDevice() && this.level > 0;
  }

  backLongpress = false;
  backPressTimeout;
  backTouchStart(e: TouchEvent | MouseEvent): void {
    e.stopPropagation();
    e.preventDefault();
    this.backLongpress = false;
    this.backPressTimeout = setTimeout(() => {
      this.backLongpress = true;
      this.docAction.emit({ action: 'go-top', value: true });
    }, 1000);
  }
  backTouchEnd(e: TouchEvent | MouseEvent): void {
    clearTimeout(this.backPressTimeout);
    e.stopPropagation();
    e.preventDefault();
    if (!this.backLongpress) {
      this.docAction.emit({ action: 'go-back', value: true });
    }
  }
  isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }
  renderTouchBackBtn() {
    return (
      <ion-fab-button
        slot="fab-top-start"
        class="nav-back"
        onTouchStart={(e) => this.backTouchStart(e)}
        onTouchEnd={(e) => this.backTouchEnd(e)}
      >
        <ion-icon size="large" name="chevron-back-outline"></ion-icon>
        <ion-icon
          size="large"
          class="second-chevron"
          name="chevron-back-outline"
        ></ion-icon>
      </ion-fab-button>
    );
  }
  renderClickBackBtn() {
    return (
      <ion-button
        color="dark"
        onMouseDown={(e) => this.backTouchStart(e)}
        onMouseUp={(e) => this.backTouchEnd(e)}
      >
        <ion-icon name="chevron-back-outline" slot="start"></ion-icon>
        <ion-label>Back</ion-label>
      </ion-button>
    );
  }

  render() {
    return (
      <Host>
        <ion-header translucent={true}>
          <ion-toolbar class="banner">
            <ion-buttons slot="start">
              {this.showClickBack() && this.renderClickBackBtn()}
            </ion-buttons>
            <ion-buttons slot="end">
              {/* <ion-button>
              <ion-icon name="ellipsis-horizontal"></ion-icon>
            </ion-button> */}
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <d2-rcard data={this.data}>
          {this.data.isRoot && <d2-head-format 
                  slot="card-top"
                  symthinkDoc={this.symthinkDoc}
                  created={AppSvc.docMeta.timeCreated}
                  modified={AppSvc.docMeta.updated}
                  displayName={AppSvc.docMeta.author}
          />}
          {!this.data.isRoot && <div slot="card-top" class="spacer-row"></div>}
          {this.showTouchBack() && this.renderTouchBackBtn()}
        </d2-rcard>
      </Host>
    );
  }
}
