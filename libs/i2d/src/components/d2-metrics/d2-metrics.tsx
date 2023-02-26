import { Component, h, JSX, Prop, Listen, State } from '@stencil/core';
import {
  SymThinkDocument,
  CardRules,
  ARG_TYPE,
} from '../../core/symthink.class';
import { Subject } from 'rxjs';

interface IMetricInfo {
  name: string;
  icon?: JSX.IntrinsicElements;
  info: any;
  initBreakpoint?: number;
}

@Component({
  tag: 'd2-metrics',
  styleUrl: 'd2-metrics.scss',
  shadow: true,
})
export class D2Metrics {
  /**
   * Symthink Document
   */
  @Prop() symthinkDoc: SymThinkDocument;
  @Prop() refresh?: Subject<any | void>;
  @Prop() modalClassName?: string;
  @State() modified = false;
  @State() modalIsOpen = false;

  st: { questionCnt: number; claimCnt: number; ideaCnt: number };
  sourceCnt: number;
  depth: number;
  totalNodes: number;
  selected: IMetricInfo;
  queMargin: number;
  clmMargin: number;
  idaMargin: number;
  target: number;
  targetMargin: number;
  mindsetVal: string;
  queChar: string;
  clmChar: string;
  idaChar: string;

  get questionCnt() {
    return this.st?.questionCnt;
  }

  get claimCnt() {
    return this.st?.claimCnt;
  }

  get ideaCnt() {
    return this.st?.ideaCnt;
  }

  getMargin(value: number) {
    const absVal = Math.abs(value);
    if (absVal > this.targetMargin) {
      return (
        <span style={{ color: 'red' }}>{value > 0 ? '+' + value : value}</span>
      );
    } else {
      return <span style={{ color: 'green' }}>{value}</span>;
    }
  }

  list: IMetricInfo[] = [
    {
      name: 'sources',
      info: () => (
        <div>
          <p>
            This badge displays the total sources cited for this symthink
            document.
          </p>
        </div>
      ),
    },
    {
      name: 'mindset',
      icon: <span class="gankyil-symbol"></span>,
      initBreakpoint: 0.6,
      info: () => (
        <div>
          <p>
            This badge displays your most dominant mindset in this symthink,
            or,&nbsp;<b></b>&nbsp;if you achieve the target range below,
            indicating a close balance between a curious, confident and creative
            mindset.
          </p>

          <ion-list>
            <ion-item lines="none">
              <ion-label style={{ 'text-align': 'right' }}>
                Target: {this.target} +/- {this.targetMargin}
              </ion-label>
            </ion-item>
            <ion-item>
              <ion-text slot="start">{this.queChar}</ion-text>
              <ion-label>
                <div style={{ float: 'right' }}>
                  {this.getMargin(this.queMargin)}
                </div>
                Curious
              </ion-label>
              <ion-text slot="end">{this.st.questionCnt}</ion-text>
            </ion-item>
            <ion-item>
              <ion-text slot="start">{this.clmChar}</ion-text>
              <ion-label>
                <div style={{ float: 'right' }}>
                  {this.getMargin(this.clmMargin)}
                </div>
                Confident
              </ion-label>
              <ion-text slot="end">{this.st.claimCnt}</ion-text>
            </ion-item>
            <ion-item lines="full">
              <ion-text slot="start">{this.idaChar}</ion-text>
              <ion-label>
                <div style={{ float: 'right' }}>
                  {this.getMargin(this.idaMargin)}
                </div>
                Creative
              </ion-label>
              <ion-text slot="end">{this.st.ideaCnt}</ion-text>
            </ion-item>
            <ion-item lines="none">
              <ion-label class="ion-text-right">Total items: </ion-label>
              <ion-text slot="end">{this.totalNodes}</ion-text>
            </ion-item>
          </ion-list>
        </div>
      ),
    },
    {
      name: 'depth',
      info: () => (
        <div>
          <p>
            This badge displays the deepest level of any of your extended bullet
            points or numbers.
          </p>
        </div>
      ),
    },
  ];
  modalEl: HTMLIonModalElement;

  componentWillLoad() {
    if (this.refresh) {
      this.refresh.subscribe(() => (this.modified = !this.modified));
    }
    this.calculate();
  }

  calculate() {
    this.st = this.symthinkDoc.getTotalsByType();
    this.totalNodes = this.st.claimCnt + this.st.questionCnt + this.st.ideaCnt;
    this.targetMargin = Math.round(this.totalNodes * 0.08 * 10) / 10;
    this.sourceCnt = this.symthinkDoc.getTotalSources();
    const a = this.symthinkDoc.getDepth();
    this.depth = a.dep;

    const avg = this.totalNodes / 3;
    this.clmMargin = this.st.claimCnt - avg;
    this.idaMargin = this.st.ideaCnt - avg;
    this.queMargin = this.st.questionCnt - avg;
    this.clmMargin = Math.round(this.clmMargin * 10) / 10;
    this.idaMargin = Math.round(this.idaMargin * 10) / 10;
    this.queMargin = Math.round(this.queMargin * 10) / 10;
    this.target = Math.round(avg * 100) / 100; // 2 decimal float
    this.queChar = CardRules.find((cr) => cr.type === ARG_TYPE.Question).char;
    this.clmChar = CardRules.find((cr) => cr.type === ARG_TYPE.Claim).char;
    this.idaChar = CardRules.find((cr) => cr.type === ARG_TYPE.Idea).char;

    this.mindsetVal = '';
    if (this.queMargin > this.targetMargin) {
      this.mindsetVal += this.queChar;
    }
    if (this.clmMargin > this.targetMargin) {
      this.mindsetVal += this.clmChar;
    }
    if (this.idaMargin > this.targetMargin) {
      this.mindsetVal += this.idaChar;
    }
    if (!this.mindsetVal) {
      this.mindsetVal = ''; // Gankyll symbol
    }

    this.modified = !this.modified;
  }

  @Listen('metricClick')
  async onMetricClick(evt: CustomEvent) {
    const metric = evt.detail;
    const met = this.list.find((m) => m.name === metric);
    if (met) {
      this.selected = met;
      this.modalIsOpen = true;
    }
  }

  componentDidRender() {
    this.modalEl.removeEventListener('ionModalWillPresent', () =>
      this.calculate()
    );
    this.modalEl.addEventListener('ionModalWillPresent', () =>
      this.calculate()
    );
    this.modalEl.onDidDismiss().then(() => (this.modalIsOpen = false));
  }

  render() {
    const breakPoint = this.selected?.initBreakpoint || 0.25;
    return (
      <div class="container">
        {/* <d2-metric name="sources" value={this.sourceCnt} />
        <d2-metric name="depth" value={this.depth} />
        <d2-metric name="mindset" value={`${this.mindsetVal}`} /> */}
        <ion-chip class="metric sources">
          <ion-label>Sources&nbsp;</ion-label>
          <div class="circle">{this.sourceCnt}</div>
        </ion-chip>
        <ion-chip class="metric depth">
          <ion-label>Depth&nbsp;</ion-label>
          <div class="circle">{this.depth}</div>
        </ion-chip>
        <ion-chip class="metric mindset">
          <ion-label>Mindset&nbsp;</ion-label>
          <div class="circle">{`0`}</div>
        </ion-chip>
        <ion-modal
          class={this.modalClassName}
          ref={(e) => (this.modalEl = e as HTMLIonModalElement)}
          isOpen={this.modalIsOpen}
          initial-breakpoint={breakPoint}
          breakpoints={[0, 0.25, 0.6, 0.8]}
        >
          <ion-header>
            <ion-toolbar>
              <ion-title>{this.selected?.name}</ion-title>
            </ion-toolbar>
          </ion-header>
          <ion-content class="ion-padding">{this.selected?.info()}</ion-content>
        </ion-modal>
      </div>
    );
  }
}
