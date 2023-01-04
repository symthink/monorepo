import { Component, Prop, h, State, Host } from '@stencil/core';

@Component({
  tag: 'd2-icon',
  shadow: true,
  assetsDirs: ['assets'],
})
export class D2Icon {
  @Prop() label: any;
  @Prop() expandable = false;
  @State() modified = false;

  renderText() {
    let style = {};
    if (this.expandable) {
      style = { position: 'absolute' };
    }
    switch (this.label) {
      case 'therefore':
        if (this.expandable) {
          style['top'] = '-2px';
          style['left'] = '11px';
          style['font-size'] = '1.6em';
        } else {
          style['font-size'] = '2em';
          style['opacity'] = '0.8';
          style['margin-top'] = '-5px';
        }
        return <div style={style}>{'\u2234'}</div>;
      case 'bullet':
        style['font-size'] = '1.5em';
        style['opacity'] = '0.8';
        if (this.expandable) {
          style['top'] = '8px';
          style['left'] = '14.5px';
        } else {
          style['margin-top'] = '6px';
        }
        return <div style={style}>&#x2022;</div>;
      default:
        style['font-size'] = '1em';
        style['font-family'] = 'monospace';
        style['opacity'] = '0.8';
        if (this.expandable) {
          style['top'] = '11px';
          style['left'] = '14.5px';
        } else {
          style['margin-top'] = '5px';
        }
        const num = /^[0-9]+$/.test(this.label) ? this.label : '-';
        return <div style={style}>{num}</div>;
    }
  }

  renderSVG() {
    return <svg
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    viewBox="0 0 402.6 557"
  >
    <g style={{opacity: '0.5'}}>
      <path
        fill="currentColor"
        d="M201.1,0.2L5.6,137.2c0,0-14,11.4,0,22.8c14,11.4,27.9,0,27.9,0L201.1,45.9l167.6,114.2c0,0,14,11.4,27.9,0
c14-11.4,0-22.8,0-22.8L201.1,0.2z"
      />
      <path
        fill="currentColor"
        d="M201.1,557l195.5-137c0,0,14-11.4,0-22.8c-14-11.4-27.9,0-27.9,0L201.1,511.3L33.5,397.1c0,0-14-11.4-27.9,0s0,22.8,0,22.8
"
      />
    </g>
  </svg>
  }

  render() {
    // const expander = getAssetPath('./assets/expander.svg');
    if (this.expandable) {
      return (
        <Host
          style={{ display: 'block', width: '25px', margin: '0px 8px 0px' }}
        >
          {this.renderSVG()}
          {this.renderText()}
        </Host>
      );
    } else {
      return (
        <Host
          style={{
            display: 'flex',
            width: '30px',
            height: '30px',
            'justify-content': 'center',
            'align-items': 'center',
            margin: '0px 2px 8px 8px',
          }}
        >
          {this.renderText()}
        </Host>
      );
    }
  }
}

// viewBox="0 0 16 30"
// width="30px"
// preserveAspectRatio="xMidYMin meet"
