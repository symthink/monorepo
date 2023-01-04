import { Component, h, Prop, State } from '@stencil/core';

@Component({
  tag: 'd2-bullet',
  shadow: true,
})
export class D2Bullet {
  @Prop() label: any;
  @Prop() expandable = false;
  @State() modified = false;

  renderLabel() {
    if (!this.label) {
      // bullet
      return <text style={{'font-size':'0.8em'}} x="5" y="16" fill="currentColor">&#x2022;</text>;
    }
    if (isNaN(this.label)) { 
      // conclusion
      return <text style={{'font-size':'1.4em'}} x="5.2" y="14" fill="currentColor">{this.label}</text>;
    }
    // number
    return <text  style={{'font-size':'1.4em'}} x="5.2" y="14" fill="currentColor">{this.label}</text>;
  }

  renderbullet() {
    return <img src="./bullet.svg" />
  }

  render_old() {
    return (
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 30"
        width="30px"
        preserveAspectRatio="xMidYMin meet"
      >
        <g style={{ display: this.expandable ? 'block' : 'none', 'opacity':'0.3' }}>
          <path
            fill="currentColor"
            d="M8,0L1,6c0,0-0.5,0.5,0,1c0.5,0.5,1,0,1,0l6-5l6,5c0,0,0.5,0.5,1,0c0.5-0.5,0-1,0-1L8,0z"
          />
          <path
            fill="currentColor"
            d="M8,20l7-6c0,0,0.5-0.5,0-1c-0.5-0.5-1,0-1,0l-6,5l-6-5c0,0-0.5-0.5-1,0c-0.5,0.5,0,1,0,1"
          />
        </g>
        <g>
          {this.renderLabel()}
        </g>
      </svg>
    );
  }
}
