import {
  Component,
  Event,
  EventEmitter,
  Prop,
  Host,
  h,
  JSX,
} from '@stencil/core';

interface IMetric {
  name: string;
  label: string;
  color: string;
  icon: JSX.IntrinsicElements;
}

@Component({
  tag: 'd2-metric',
  styleUrl: 'd2-metric.css',
  shadow: true,
})
export class D2Metric {
  @Prop() name: string;
  @Prop() value: string | number;

  @Event() metricClick: EventEmitter<string>;

  async onClick(metric: string) {
    this.metricClick.emit(metric);
  }

  // maybe later add some measure of effort (🏃) and sentiment (😠)

  list: IMetric[] = [
    {
      name: 'sources',
      label: 'sources',
      color: 'purple',
      icon: (
        <ion-icon
          class="icon bookmark"
          size="small"
          name="bookmark-outline"
        ></ion-icon>
      ),
    },
    {
      name: 'mindset',
      label: 'mindset',
      color: 'green',
      // icon: <span></span>,
      icon: <span class="icon gankyil-symbol"></span>,
    },
    {
      name: 'depth',
      label: 'depth',
      color: 'orange',
      icon: <span class="icon down-arrow">&#x2193;</span>,
    },
  ];

  render() {
    const metric = this.list.find((m) => this.name === m.name);
    if (metric) {
      return (
        <Host onClick={this.onClick.bind(this, this.name)}>
          <span class="first">
            {metric.icon}&nbsp;&nbsp;{metric.label}
          </span>
          <div class={metric.color}>
            <span class="val">{this.value}</span>
          </div>
        </Host>
      );
    } else {
      return (
        <Host>
          <span class="first">{this.name}</span>
          <span class={metric.color}>n.a.</span>
        </Host>
      );
    }
  }

  // later try this
  renderSvg() {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="70.3"
        height="20"
        viewBox="0 0 703 200"
        role="img"
        aria-label="color: blue"
      >
        <title>color: blue</title>
        <linearGradient id="a" x2="0" y2="100%">
          <stop offset="0" stop-opacity=".1" stop-color="#EEE" />
          <stop offset="1" stop-opacity=".1" />
        </linearGradient>
        <mask id="m">
          <rect width="703" height="200" rx="30" fill="#FFF" />
        </mask>
        <g mask="url(#m)">
          <rect width="368" height="200" fill="#555" />
          <rect width="335" height="200" fill="#08C" x="368" />
          <rect width="703" height="200" fill="url(#a)" />
        </g>
        <g
          aria-hidden="true"
          fill="#fff"
          text-anchor="start"
          font-family="Verdana,DejaVu Sans,sans-serif"
          font-size="110"
        >
          <text x="60" y="148" textLength="268" fill="#000" opacity="0.25">
            color
          </text>
          <text x="50" y="138" textLength="268">
            color
          </text>
          <text x="423" y="148" textLength="235" fill="#000" opacity="0.25">
            blue
          </text>
          <text x="413" y="138" textLength="235">
            blue
          </text>
        </g>
      </svg>
    );
  }
}
