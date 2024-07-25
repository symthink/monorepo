import { Component, h, State } from '@stencil/core';

import * as jsonData from '../../assets/data.json';

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css',
  shadow: false,
})
export class AppRoot {
  @State() action: number = 0;
  @State() value: any = '';

  componentDidLoad() {
    console.log('Component loaded', jsonData);
    this.value = jsonData;
    window.addEventListener('message', (event) => {
      // console.log('Received message from iframe:', event.data);
      if (event.data?.hello) return;

      console.log(`[Parent win] received event - Action: ${event.data.action}`);
      console.log(`Value: `, event.data.value);
    });
  }

  sendMessage = () => {
    const iframe = document.querySelector('iframe');
    const message = { action: this.action, value: this.value };
    console.log('Sending message to iframe:', message)
    iframe.contentWindow.postMessage(message, '*');
  }

  sendEdit() {
    this.action = 2;
    this.sendMessage();
  }
  sendRead() {  
    this.action = 1;
    this.sendMessage();
  }

  render() {
    return (
      <div>
        <header>
          <h1>Symthink Document Testing Frame</h1><div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
          <button onClick={() => this.sendEdit()}>Edit doc</button><div>&nbsp;&nbsp;&nbsp;</div>
          <button onClick={() => this.sendRead()}>Read-only</button>
        </header>
        <div style={{ display: 'flex', height: '100vh' }}>
          <iframe src="http://localhost:3334" width="100%" style={{ height: '100%' }}></iframe>
        </div>
      </div>
    );
  }
}
