import { Component, Host, h, Element, Prop, Watch } from '@stencil/core';
import { Event, EventEmitter } from '@stencil/core';

interface ITree {
  id: string;
  title: string;
  page: number[];
  links: ITree[];
}

@Component({
  tag: 'd2-tree',
  styleUrl: 'd2-tree.css',
  shadow: true,
})
export class D2Tree {
  @Element() el: HTMLElement;

  @Prop() data: string | object;
  @Prop() current: string;

  @Event({
    eventName: 'closeGoRequest',
    composed: true,
    cancelable: true,
    bubbles: true,
  }) closeGoRequest: EventEmitter<string | null>

  private innerData: ITree;
  private innerCurrent: string;
  private level = 0;

  getTitleTag(level: number, title: string) {
    switch (level) {
      case 1:
        return <h1>{title}</h1>
      case 2:
        return <h2>{title}</h2>
      case 3:
        return <h3>{title}</h3>
      case 4:
        return <h4>{title}</h4>
      case 5:
        return <h5>{title}</h5>
      case 6:
        return <h6>{title}</h6>
      default:
        return <div class="lev_{level}">{title}</div>
    }
  }

  setPages(node?: ITree) {
    let cnode = node || this.innerData;
    let page = cnode.page || [0];
    if (cnode.links) {
      for (let x of cnode.links.keys()) {
        cnode.links[x].page = page.concat([x]);
        this.setPages(cnode.links[x]);
      }
    }
  }

  getPage(pageIndex: number[]) {
    return Array.from(pageIndex, x => 1 + x).join('.');
  }

  emitCloseGoRequest(page?: string) {
    this.closeGoRequest.emit(page);
  }

  @Watch('data')
  onDataChange(newValue: any) {
    if (newValue) {
      if (typeof newValue === 'object') {
        this.innerData = Object.assign({page: [0]}, newValue) as ITree;
      } else if (typeof newValue === 'string') {
        let tmp = JSON.parse(newValue) as ITree;
        this.innerData = Object.assign({page: [0]}, tmp);
      }
      this.setPages();
      // console.log(this.innerData)
    }
  }

  @Watch('current')
  onCurrentChange(newValue: string) {
    if (newValue) {
      this.innerCurrent = newValue;

    }
  }

  /**
   * Stencil LifeCycle Methods **************************
   */
  componentWillLoad() {
    if (this.data) {
      this.onDataChange(this.data);
    }
    if (this.current) {
      this.onCurrentChange(this.current);
    }
  }

  /**
   * Rendering Methods
   */
  renderLevel(lev: ITree) {
    this.level++;
    const hasNextLevel = !!(lev.links && lev.links.length);
    const pageId = this.getPage(lev.page);
    const isCurrent = this.innerCurrent === pageId;
    const titleTag = this.getTitleTag(this.level, lev.title);
    const rendrLevel = this.renderLevel.bind(this);
    const listTag = hasNextLevel && (<ol>{lev.links.map((l) => rendrLevel(l))}</ol>);
    this.level--;
    return <li>
      <div class={isCurrent && 'current'} onClick={() => this.emitCloseGoRequest(pageId)}>{titleTag}</div>
      {listTag}
    </li>
  }

  render() {
    if (this.innerData) {
      return (
        <Host>
          <div id="wrapper">
            <header>
              <div>&nbsp;</div>
              <div>&nbsp;</div>
              <div onClick={() => this.emitCloseGoRequest()}>
              <a class="button close">
                <span class="icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                  </svg>
                </span>
              </a>
              &nbsp;Close
              </div>
            </header>
            <div id="container">
              <ol class="arg-outline">
                {this.renderLevel(this.innerData)}
              </ol>
            </div>
          </div>
        </Host>
      );
    }
  }
}
