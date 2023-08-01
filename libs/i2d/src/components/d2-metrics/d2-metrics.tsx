import { Component, h, JSX, Prop, Listen, State } from '@stencil/core';
import {
  SymThinkDocument,
  CardRules,
  ARG_TYPE,
  StLogActionEnum,
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

  selected: IMetricInfo;
  sourceCnt: number;
  totalNodes: number;
  // st: { questionCnt: number; claimCnt: number; ideaCnt: number };
  // depth: number;
  // queMargin: number;
  // clmMargin: number;
  // idaMargin: number;
  // target: number;
  // targetMargin: number;
  // mindsetVal: string;
  // queChar: string;
  // clmChar: string;
  // idaChar: string;

  // get questionCnt() {
  //   return this.st?.questionCnt;
  // }

  // get claimCnt() {
  //   return this.st?.claimCnt;
  // }

  // get ideaCnt() {
  //   return this.st?.ideaCnt;
  // }

  // getMargin(value: number) {
  //   const absVal = Math.abs(value);
  //   if (absVal > this.targetMargin) {
  //     return (
  //       <span style={{ color: 'red' }}>{value > 0 ? '+' + value : value}</span>
  //     );
  //   } else {
  //     return <span style={{ color: 'green' }}>{value}</span>;
  //   }
  // }

  list: IMetricInfo[] = [
    {
      name: 'Sources',
      info: () => (
        <div>
          <p>
            This badge displays the total sources cited in this document.
          </p>
        </div>
      ),
    },
    {
      name: 'Mindset',
      icon: <span class="gankyil-symbol"></span>,
      initBreakpoint: 0.6,
      info: () => (
        <div>
          <p>
            This badge measures the number of times you have iterated through
            the steps of: Question &gt; Idea &gt; Claim, in process of
            developing this document.
          </p>
          <p>
            The steps can be accomplished independently or by posting a question
            to a region to solicit ideas & claims from others in that region. If
            done independently, you simply add your own ideas under a question,
            then claims under the ideas as needed. Then sort your ideas with
            your first choice at the top. And finally, on the question, you
            select the option "Decision" to promote the top idea, which then
            replaces the question.
          </p>
        </div>
      ),
    },
    {
      name: 'Depth',
      info: () => (
        <div>
          <p>
            This badge displays the total statements of any type and the deepest
            level of any of your extended bullet points or numbers.
            <pre>TOTAL-DEPTH</pre>
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
    if (this.symthinkDoc.mod$) {
      this.symthinkDoc.mod$.subscribe(() => {
        this.calculate();
      });
      if (this.symthinkDoc.log$) {
        this.symthinkDoc.log$.subscribe((a) => {
          if (a.action === StLogActionEnum.ADD_SOURCE) {
            this.calculate();
          }
        });
      }
    }
    this.calculate();
  }

  calculate() {
    this.sourceCnt = this.symthinkDoc.getTotalSources();
    this.totalNodes = this.symthinkDoc.getTotalNodes();
    // this.st = this.symthinkDoc.getTotalsByType();
    // this.targetMargin = Math.round(this.totalNodes * 0.08 * 10) / 10;
    // const a = this.symthinkDoc.getDepth();
    // this.depth = a.dep;
    // const avg = this.totalNodes / 3;
    // this.clmMargin = this.st.claimCnt - avg;
    // this.idaMargin = this.st.ideaCnt - avg;
    // this.queMargin = this.st.questionCnt - avg;
    // this.clmMargin = Math.round(this.clmMargin * 10) / 10;
    // this.idaMargin = Math.round(this.idaMargin * 10) / 10;
    // this.queMargin = Math.round(this.queMargin * 10) / 10;
    // this.target = Math.round(avg * 100) / 100; // 2 decimal float
    // this.queChar = CardRules.find((cr) => cr.type === ARG_TYPE.Question).char;
    // this.clmChar = CardRules.find((cr) => cr.type === ARG_TYPE.Claim).char;
    // this.idaChar = CardRules.find((cr) => cr.type === ARG_TYPE.Idea).char;

    // this.mindsetVal = '';
    // if (this.queMargin > this.targetMargin) {
    //   this.mindsetVal += this.queChar;
    // }
    // if (this.clmMargin > this.targetMargin) {
    //   this.mindsetVal += this.clmChar;
    // }
    // if (this.idaMargin > this.targetMargin) {
    //   this.mindsetVal += this.idaChar;
    // }
    // if (!this.mindsetVal) {
    //   this.mindsetVal = ''; // Gankyll symbol
    // }

    this.modified = !this.modified;
  }

  // @Listen('metricClick')
  // async onMetricClick(evt: CustomEvent) {
  //   console.log('onMetricClick', evt.detail);
  //   const metric = evt.detail.value;
  //   const met = this.list.find((m) => m.name === metric);
  //   if (met) {
  //     this.selected = met;
  //     this.modalIsOpen = true;
  //   }
  // }
  async onMetricClick(metric: string) {
    const met = this.list.find((m) => m.name === metric);
    if (met) {
      this.selected = met;
      this.modalIsOpen = true;
    }
  }

  componentDidRender() {
    // this.modalEl.removeEventListener('ionModalWillPresent', () =>
    //   this.calculate()
    // );
    // this.modalEl.addEventListener('ionModalWillPresent', () =>
    //   this.calculate()
    // );
    this.modalEl.onDidDismiss().then(() => (this.modalIsOpen = false));
  }

  get decisionCnt() {
    if (this.symthinkDoc.decisions?.length) {
      return this.symthinkDoc.decisions.length;
    }
    return 0;
  }

  render() {
    const breakPoint = this.selected?.initBreakpoint || 0.6;
    return (
      <div class="container">
        {/* <d2-metric name="sources" value={this.sourceCnt} />
        <d2-metric name="depth" value={this.depth} />
        <d2-metric name="mindset" value={`${this.mindsetVal}`} /> */}
        <ion-chip
          class="metric depth"
          onClick={() => this.onMetricClick('Depth')}
        >
          <ion-label>Items&nbsp;</ion-label>
          <div class="circle">{this.totalNodes}</div>
        </ion-chip>
        <ion-chip
          class="metric sources"
          onClick={() => this.onMetricClick('Sources')}
        >
          <ion-label>Sources&nbsp;</ion-label>
          <div class="circle">{this.sourceCnt}</div>
        </ion-chip>{' '}
        <ion-chip
          class="metric mindset"
          onClick={() => this.onMetricClick('Mindset')}
        >
          <ion-label>Mindset&nbsp;</ion-label>
          <div class="circle">{this.decisionCnt}</div>
        </ion-chip>
        <ion-modal
          class={this.modalClassName}
          ref={(e) => (this.modalEl = e as HTMLIonModalElement)}
          isOpen={this.modalIsOpen}
          initial-breakpoint={breakPoint}
          breakpoints={[0, 0.25, 0.6, 0.8]}
        >
          <ion-header>
            <ion-toolbar color="light">
              <ion-title>{this.selected?.name}</ion-title>
            </ion-toolbar>
          </ion-header>
          <ion-content class="ion-padding">{this.selected?.info()}</ion-content>
        </ion-modal>
      </div>
    );
  }
}
