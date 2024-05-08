import { Component, h, State } from '@stencil/core';

import * as jsonData from '../../../../../data2.json';

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css',
  shadow: false,
})
export class AppRoot {
  @State() action: number = 0;
  @State() value: any = '';

  componentDidLoad() {
    this.value = structuredClone(jsonData);
    window.addEventListener('message', (event) => {
      console.log('Received message from iframe:', event.data);
      switch (event.data.action) {
        case 102:
          console.error('Error received from Symthink Doc');
          console.warn(event.data.value);
          break;
        default:
          console.log('Event received but not handled in app-root');
          console.log(event.data);
      }
    });
  }

  sendMessage = () => {
    const iframe = document.querySelector('iframe');
    const message = { action: this.action, value: this.value };
    console.log('Sending message to iframe:', message)
    iframe.contentWindow.postMessage(message, '*');
  }

  handleActionChange = (event) => {
    this.action = parseInt(event.detail.value);
    console.log('Action changed:', this.action)
  }

  handleValueChange = (event) => {
    this.value = structuredClone(JSON.parse(event.target.value));
  }

  render() {
    return (
      <div>
        <header>
          <h1>Symthink Document Testing Frame</h1>
        </header>
        <div style={{ display: 'flex', height: '100vh' }}>
          <div style={{ flex: '3' }}>
            <iframe src="http://localhost:3342" width="100%" style={{ height: '100%' }}></iframe>
          </div>
          <div style={{ 'min-width': '400px', flex: '1' }}>
            <ion-radio-group onIonChange={this.handleActionChange}>
              <ion-item>
                <ion-label>READDOC</ion-label>
                <ion-radio slot="start" value="1" />
              </ion-item>

              <ion-item>
                <ion-label>EDITDOC</ion-label>
                <ion-radio slot="start" value="2" />
              </ion-item>

              <ion-item>
                <ion-label>DIDSAVE</ion-label>
                <ion-radio slot="start" value="3" />
              </ion-item>

              <ion-item>
                <ion-label>VIEWTREE</ion-label>
                <ion-radio slot="start" value="4" />
              </ion-item>

              <ion-item>
                <ion-label>SOURCE</ion-label>
                <ion-radio slot="start" value="5" />
              </ion-item>

              <ion-item>
                <ion-label>POSTBACK</ion-label>
                <ion-radio slot="start" value="6" />
              </ion-item>
              <ion-item>
                <ion-label>RECYCLE</ion-label>
                <ion-radio slot="start" value="8" />
              </ion-item>
              <ion-item>
                <ion-label>THEREFORE</ion-label>
                <ion-radio slot="start" value="9" />
              </ion-item>
              <ion-item>
                <ion-label>LISTTYPE</ion-label>
                <ion-radio slot="start" value="10" />
              </ion-item>
              <ion-item>
                <ion-label>REORDER</ion-label>
                <ion-radio slot="start" value="11" />
              </ion-item>
            </ion-radio-group>
            &nbsp;&nbsp;&nbsp;
            <button onClick={this.sendMessage} style={{ marginTop: '10px' }}>Send Message</button>

            <textarea
              placeholder="Enter value here..."
              onInput={this.handleValueChange}
              style={{ width: '100%', height: '50%', marginTop: '10px' }}
            >
              
            </textarea>
          </div>
        </div>
      </div>
    );
  }
}
