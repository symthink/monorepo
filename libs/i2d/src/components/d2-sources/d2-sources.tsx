import { Component, h, Prop, State, Element, Method, Host } from '@stencil/core';
import { IReference } from '../../core/interfaces';


@Component({
  tag: 'd2-sources',
  styleUrl: 'd2-sources.scss',
  shadow: true,
})
export class D2Sources {
  @Element() el: HTMLElement;

  @Prop() sources: IReference[] = [];
  // @Prop() contributors: any[] = [];

  /**
   * Trigger re-render
   */
  @State() sourceId: string = null;
  @State() showContrib = false;

  @Method()
  showSourcesPanel(id: string) {
    this.sourceId = id;
    console.log('showSourcesPanel', id);
    const el = this.el.shadowRoot.querySelector('.source-panel') as HTMLElement;
    el.classList.add('modal');  
  }

  get modalSources(): IReference[] {
    let source = this.sources.find(s => s.id === this.sourceId);
    return source ? [source] : this.sources;
  }

  closeSourcesPanel() {
    const el = this.el.shadowRoot.querySelector('.source-panel') as HTMLElement;
    el.classList.add('modal-close');
    setTimeout(() => {
      el.classList.remove('modal');
      el.classList.remove('modal-close');
    }, 1100);  
  }

  renderSource(source: IReference) {
    let url = source.url.toString();
    return (
      <tr>
        <td class="first">{source.id})</td>
        <td class="middle">
          <div class="name">{source.name ? source.name : source.url.host}</div>
          <span class="url-path">{source.url.pathname}</span>
        </td>
        <td class="last">
          <a class="button launch" href={url} target="_blank">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              class="bi bi-box-arrow-up-right"
            >
              <path
                fill-rule="evenodd"
                d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"
              />
              <path
                fill-rule="evenodd"
                d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"
              />
            </svg>
          </a>
        </td>
      </tr>
    );
  }

  render() {
    return (
      <Host>
      <div class="source-panel">
        <header>
          <div
            class={this.showContrib ? 'tab active' : 'tab'}
            onClick={() => (this.showContrib = true)}
          >
            <h4>Contributors</h4>
          </div>
          <div
            class={this.showContrib ? 'tab' : 'tab active'}
            onClick={() => (this.showContrib = false)}
          >
            <h4>Sources</h4>
          </div>
          <a class="button close" onClick={() => this.closeSourcesPanel() }>
            <span class="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-x-circle"
                viewBox="0 0 16 16"
              >
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
              </svg>
            </span>
          </a>
        </header>
        <table class={!this.showContrib ? 'hide' : 'contributors'}>
          <tr>
            <td>&nbsp;Okean Crawely</td>
            <td>Posted: Jan 3rd, 2020</td>
          </tr>
          <tr>
            <td>&nbsp;Jefferson Davis</td>
            <td>Feb 13th, 2020</td>
          </tr>
          <tr>
            <td>&nbsp;Aretha Franklin</td>
            <td>Mar 10th, 2020</td>
          </tr>
          <tr>
            <td>&nbsp;George Washington</td>
            <td>Jan 2nd, 2021</td>
          </tr>
        </table>
        <table class={this.showContrib ? 'hide' : 'sources'}>
          {this.modalSources.map((source) => this.renderSource(source))}
        </table>
      </div>
      </Host>
    );
  }
}
