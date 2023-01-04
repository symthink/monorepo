import { Component, Event, EventEmitter, h, Prop, Host } from '@stencil/core';
import { SymThink, SymThinkDocument } from '@symthink/i2d';
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

  renderRootSubheader() {
    return [
      <div
        class={{ 'doc-title': true, invisible: !!!this.symthinkDoc.label }}
        slot="card-top"
      >
        <h1>{this.symthinkDoc.label}</h1>
      </div>,
      <div class="by-line" slot="card-top">
        By {AppSvc.author} {!AppSvc.isWidescreen && <br />}on {AppSvc.created}
        <br />
        updated {AppSvc.updated}
      </div>,
      <d2-metrics
        slot="card-top"
        symthinkDoc={this.symthinkDoc}
        modalClassName="modal-sheet sym-text"
      />,
    ];
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
          {this.data.isRoot && this.renderRootSubheader()}
          {!this.data.isRoot && <div slot="card-top" class="spacer-row"></div>}
          {this.showTouchBack() && this.renderTouchBackBtn()}
        </d2-rcard>
      </Host>
    );
  }
}
