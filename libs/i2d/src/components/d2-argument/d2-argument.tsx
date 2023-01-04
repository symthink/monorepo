import { Component, h, Prop, State, Watch, Element, Host, Listen, Event, EventEmitter } from '@stencil/core';
import { touchSupported, loadJSON, loadLocalFileJson, limit } from '../../helpers/utils';
import { Swiper, SwiperOptions, Pagination, Virtual } from 'swiper';
import { IReference } from '../../core/interfaces';
import dayjs, { Dayjs } from 'dayjs';

Swiper.use([Pagination, Virtual]);

enum ARG_LABEL {
  Syllogism = 'Syllogism', // A=Claim Support=Premises B=Conclusion
  Induction = 'Induction', // A=Observation Support=Analysis B=Inference
  Deduction = 'Deduction', // A=Hypothesis Support=Observations
  Abduction = 'Abduction', // A=Observation B=Hypotheses
  ProblemSolution = 'ProblemSolution', // A=Problem B=Solution
  Conditional = 'Conditional', // A=If,When,Cause B=Then,Effect
  Statement = 'Statement', // Support=any text; no A or B
  ValueClaim = 'ValueClaim', // A=Claim Support=SupportingClaims; no B
}

// everything below the top level
interface IArgumentSub {
  id: string;
  title?: string;
  sym?: URL; //URL path to JSON of connected argument
  text?: IText[];
  label: ARG_LABEL; // default to Statement ?
  links?: IArgumentSub[];
  page?: number[]; // index path to this arg e.g. [0,3,2,0]
  leaf?: boolean; // has no linked args
}

interface IText {
  p: string;
}

// TODO: use typedocs w/mermaidjs plugin to express relationships between these interfaces
// see: https://www.npmjs.com/package/typedoc-plugin-mermaid
// Top level
interface IArgument extends IArgumentSub {
  author?: string;
  posted?: Dayjs;
  modified?: Dayjs;
  sources?: IReference[];
}

@Component({
  tag: 'd2-argument',
  styleUrl: 'd2-argument.css',
  shadow: true,
})
export class D2Argument {
  @Element() el: HTMLElement;

  // data is parsed to innerData
  @Prop() data: string | object;
  @Prop() dataUrl: string;

  // Properties that will drive the re-rendering
  @Prop() edit: boolean;

  @State() page: string;

  @Event() exitClick: EventEmitter<void>
  @Event() moreClick: EventEmitter<void>

  title: string;

  // for d2-sources
  private sources: IReference[] = [];

  private slides: IArgument[] = [];
  private innerData: IArgument;
  private swiperOpts: SwiperOptions = {};
  private swiperCtrEl: HTMLElement;
  private fileInputEl: HTMLInputElement;
  private editModeDidChange = false;
  private slideDidPush = false;
  swiper: Swiper;

  constructor() {
    this.onEditModeChange = this.onEditModeChange.bind(this);
    this.onInputEvent = this.onInputEvent.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    this.onSlidePrevTransitionEnd = this.onSlidePrevTransitionEnd.bind(this);
    this.slides = [];
  }

  get depth(): number {
    if (this.swiper && this.swiper.slides && this.swiper.slides.length) {
      return this.swiper.slides.length;
    } else {
      return 0;
    }
  }

  get current(): IArgument {
    try {
      return this.slides[this.slides.length - 1] || null;
    } catch (e) {
      return null;
    }
  }

  removeListeners() {
    if (this.swiper) {
      // console.log('removeListeners');
      this.swiper.off('touchMove', this.onTouchMove);
      this.swiper.off('touchEnd', this.onTouchEnd);
      this.swiper.off('slidePrevTransitionEnd', this.onSlidePrevTransitionEnd);
    }
  }

  addSwiperListeners() {
    if (this.swiper) {
      this.swiper.on('touchMove', this.onTouchMove);
      this.swiper.on('touchEnd', this.onTouchEnd);
      this.swiper.on('slidePrevTransitionEnd', this.onSlidePrevTransitionEnd);
    }
  }

  getPageId(pageIndex: number[]) {
    return Array.from(pageIndex, x => 1 + x).join('.');
  }

  getPage(pageId: string) {
    return Array.from(pageId.split('.'), x => parseInt(x) - 1);
  }

  getBlankSlide(id: string, type?: ARG_LABEL): IArgument {
    return {
      id: id,
      label: type || ARG_LABEL.Statement,
      text: [
        {
          p: 'Enter text here...',
        },
      ],
    };
  }

  getObjectFromOriginalData(pages: number[]) {
    const page = Array.from(pages);
    let slide = this.innerData;
    let x = 1;
    while (page[x] !== undefined) {
      slide = slide.links[page[x]];
      x++;
    }
    return slide;
  }

  getLinkedSlide(pages: number[], id: string) {
    const page = Array.from(pages);
    let parentSlide = this.innerData;
    this.setPages();
    let x = 1;
    while (page[x] !== undefined) {
      parentSlide = parentSlide.links[page[x]];
      x++;
    }
    if (!parentSlide.links) {
      parentSlide.links = [];
    }
    let linkedSlide;
    const y = parentSlide.links.findIndex(a => a.id === id);
    if (y !== -1) {
      linkedSlide = Object.assign({}, parentSlide.links[y]);
      page.push(y);
      linkedSlide.page = page;
      try {
        linkedSlide.leaf = !!!linkedSlide.links.length;
      } catch (e) {
        linkedSlide.leaf = true;
      }
      delete linkedSlide.links;
    }
    if (!linkedSlide) {
      linkedSlide = this.getBlankSlide(id);
      parentSlide.links.push(Object.assign({}, linkedSlide));
      const x = parentSlide.links.findIndex(a => a.id === id);
      page.push(x);
      linkedSlide.page = page;
    }
    return linkedSlide;
  }

  setPages(node?: IArgumentSub) {
    let cnode = node || this.innerData;
    let page = cnode.page || [0];
    if (cnode.links) {
      for (let x of cnode.links.keys()) {
        cnode.links[x].page = page.concat([x]);
        this.setPages(cnode.links[x]);
      }
    }
  }

  toggleDisplay(el: Element) {
    if (el.classList.contains('remove')) {
      el.classList.remove('remove');
    } else {
      el.classList.add('remove');
    }
  }

  initSwiper() {
    this.swiperCtrEl = this.el.shadowRoot.querySelector('.swiper-container') as HTMLElement;
    // this.swiperCtrEl = this.el.querySelector('.swiper-container');
    if (this.swiperCtrEl && !this.swiper) {
      this.swiperOpts = {
        slidesPerView: 1,
        keyboard: {
          enabled: true,
        },
      };
      this.swiper = new Swiper(this.swiperCtrEl, this.swiperOpts);
      this.addSwiperListeners();
      // this.addSlideListeners();
    }
  }

  trimText(text: IText[], len: number) {
    let total = 0;
    text.map(t => {
      total += t.p.length;
    });
    if (total > len) {
      text.reverse();
      let removeChars = total - len;
      text = text.map(t => {
        if (removeChars < t.p.length) {
          t.p = t.p.slice(0, -removeChars) + '...';
        } else {
          t.p = '...';
        }
        return t;
      });
      text.reverse();
    }
    return text;
  }

  /**
   * Stencil LifeCycle Methods **************************
   */

  componentWillLoad() {
    if (this.data) {
      this.onDataChange(this.data);
    } else if (this.dataUrl) {
      loadJSON(this.dataUrl)
        .then((data: object) => (this.data = data))
        .catch(error => console.error(error));
    }
  }

  // componentDidLoad() {
  //   this.initSwiper();
  // }

  componentDidUpdate() {
    if (this.editModeDidChange) {
      this.onEditModeChange();
    }
  }
  componentDidRender() {
    this.initSwiper();
    if (this.swiper && this.slideDidPush) {
      this.swiper.update();
      this.swiper.slideNext(1000);
      this.slideDidPush = false;
    }
  }

  /**
   * Event Handlers *********************************
   * - host element bindings
   */
  onEditModeChange() {
    // const activeSlide = this.el.querySelector('.swiper-slide-active') as HTMLElement;
    if (this.edit) {
      // const activeSlide = this.swiperCtrEl.querySelector('.swiper-slide-active') as HTMLElement;
      // const mainSection = activeSlide.querySelector('.main') as HTMLElement;
      //   mainSection.contentEditable = 'true';
      // mainSection.addEventListener('input', (ev: any) => this.onInputEvent(ev));
      // mainSection.focus();
      this.removeListeners();
    } else {
      // const activeSlide = this.swiperCtrEl.querySelector('.swiper-slide-active') as HTMLElement;
      // const mainSection = activeSlide.querySelector('.main') as HTMLElement;
      // mainSection.removeAttribute('contenteditable');
      // mainSection.removeEventListener('input', (ev: any) => this.onInputEvent(ev));
      this.addSwiperListeners();
      // this.addSlideListeners();
    }
    this.editModeDidChange = false;
  }

  @Watch('edit')
  toggleEditModeDidChange() {
    this.editModeDidChange = true;
  }

  @Watch('data')
  onDataChange(newValue: any) {
    if (newValue) {
      if (typeof newValue === 'object') {
        this.innerData = newValue;
      } else if (typeof newValue === 'string') {
        this.innerData = JSON.parse(newValue);
      }
      if (this.innerData.posted) {
        try {
          this.innerData.posted = dayjs(this.innerData.posted);
        } catch (e) { }
      }
      if (this.innerData.modified) {
        try {
          this.innerData.modified = dayjs(this.innerData.modified);
        } catch (e) { }
      }

      // TODO: in edit mode maybe e.g. isValidAgainstSchema(this.innerData)
      if (this.innerData) {
        this.title = this.innerData.title || null;

        const rootSlide = Object.assign({ page: [0] }, this.innerData);
        try {
          rootSlide.leaf = !!!rootSlide.links.length;
        } catch (e) {
          rootSlide.leaf = true;
        }
        delete rootSlide.links;
        if (rootSlide.sources && rootSlide.sources.length) {
          this.sources = rootSlide.sources.map(a => {
            a.url = new URL(a.url.toString());
            return a;
          });
        }
        delete rootSlide.sources;
        this.slides = [rootSlide];
      }
    }
  }

  async onFileInputChange() {
    const file = this.fileInputEl.files.item(0);
    this.data = await loadLocalFileJson(file);
    this.onDataChange(this.data);
  }

  /**
   * Event Handlers *********************************
   * - swiper event handlers
   */

  onSlidePrevTransitionEnd() {
    this.page = this.getPageId(this.current.page); // triggers re-render
    this.swiper.update();
  }

  // highlight anchors
  onTouchMove(ev: any) {
    console.log('onTouchMove', ev.swipeDirection)
    if (ev.swipeDirection === 'next') {
      const anchors: NodeListOf<HTMLAnchorElement> = this.swiperCtrEl.querySelectorAll('.swiper-slide-active a');
      anchors.forEach(a => {
        if (a.classList.contains('expand') && !a.hasAttribute('show')) {
          a.setAttribute('show', '');
          setTimeout(() => a.removeAttribute('show'), 5000);
        }
      });
    }
  }

  openOutline(currentPage: string) {
    const el = this.el.shadowRoot.querySelector('#outline-panel') as HTMLElement;
    el.setAttribute('current', currentPage);
    el.classList.remove('remove');
    el.classList.add('fade-in');
  }

  @Listen('closeGoRequest')
  onOutlineCloseGoRequest(event: CustomEvent<string>) {
    const pageId: string = event.detail;
    const el = this.el.shadowRoot.querySelector('#outline-panel') as HTMLElement;
    if (pageId) {
      this.goToPage(pageId);
    }
    // el.classList.remove('fade-in');
    // el.classList.add('fade-out');  
    el.classList.add('remove');
    el.classList.remove('fade-out');
    // setTimeout(() => {
    //   }, 2500)

  }

  goToPage(pageId: string) {
    if (pageId) {
      const page = this.getPage(pageId);
      this.slides = [];
      let slide;
      for (let x = 0; x < page.length; x++) {
        let slidePage = page.slice(0, x + 1);
        slide = this.getObjectFromOriginalData(slidePage);
        this.slides.push(slide);
      }
      this.slideDidPush = true;
      this.page = this.getPageId(slide.page); // triggers re-render
    }
  }

  onTouchEnd(ev) {
    if (ev.swipeDirection === 'next') {
      this.openOutline(this.getPageId(this.current.page));
    }
  }

  /**
   * Event Handlers *********************************
   * - jsx render handlers
   */

  onInputEvent(ev) {
    console.log('input event ', ev);
    // for edit mode, could save changes here
  }

  onTopClick() {
    this.slides.splice(1, this.slides.length - 1);
    this.swiper.slideTo(0, 1000);
  }

  onBackClick() {
    this.slides.pop();
    this.swiper.slidePrev(1000);
  }

  async onInfoClick(sourceId: string) {
    console.log('onInfoClick', sourceId);
    await customElements.whenDefined('d2-sources');
    const sourcesPanel: any = this.el.shadowRoot.querySelector('d2-sources');
    await sourcesPanel.showSourcesPanel(sourceId);
  }

  onExpandClick(linkId: string) {
    console.log('onExpandClick', linkId);
    if (linkId) {
      const slide = this.slides[this.swiper.activeIndex];
      const next = this.getLinkedSlide(slide.page, linkId);
      if (next) {
        this.slides.push(next);
        this.slideDidPush = true;
        // console.log('next', this.page, this.slides.length, next);
        this.page = this.getPageId(next.page); // triggers re-render
      }
    }
  }

  onEmptyLinkClick() {
    console.log('here');
  }

  onFeaturePending() {
    alert('Feature Pending: sponsor the project to help us move faster!');
  }


  onEditClick() {
    this.edit = true; // triggers onEditModeChange()
    // reset the slide data with the original data
    const activeSlide = this.swiperCtrEl.querySelector('.swiper-slide-active') as HTMLElement;
    activeSlide.querySelector('.actions-toolbar').classList.add('remove');
    activeSlide.querySelector('.nav-header').classList.add('remove');
    activeSlide.querySelector('.edit-actions').classList.remove('remove');
  }

  onCancelEditClick() {
    this.edit = false;
    const activeSlide = this.swiperCtrEl.querySelector('.swiper-slide-active') as HTMLElement;
    activeSlide.querySelector('.actions-toolbar').classList.remove('remove');
    activeSlide.querySelector('.nav-header').classList.remove('remove');
    activeSlide.querySelector('.edit-actions').classList.add('remove');
  }

  onDoneClick() {
    // copy changes back to the data
    const activeSlide = this.swiperCtrEl.querySelector('.swiper-slide-active') as HTMLElement;
    const taEl = activeSlide.querySelector('textarea') as HTMLTextAreaElement;
    const paras = taEl.value.split('\n\n');
    let updates = [];
    paras.forEach(t => {
      updates.push({ p: t });
    });
    const slide = this.getObjectFromOriginalData(this.current.page);
    this.current.text = slide.text = updates;
    slide.text = [...updates];
    this.current.text = [...updates];
    // console.log('slide.text', slide.text);
    this.edit = false; // triggers onEditModeChange() & re-rendering
    activeSlide.querySelector('.card-actions').classList.remove('remove');
    activeSlide.querySelector('.nav-header').classList.remove('remove');
    activeSlide.querySelector('.edit-actions').classList.add('remove');
  }

  onExitClick() {
    this.exitClick.emit();
  }

  onMoreClick() {
    // this.moreClick.emit();
    const growDiv = this.el.shadowRoot.querySelector('.actions-toolbar') as HTMLElement;
    console.log('growDiv.clientHeight', growDiv.clientHeight);
    if (growDiv.clientHeight) {
      growDiv.style.height = '0';
    } else {
      var wrapper = this.el.shadowRoot.querySelector('.measuring-wrapper');
      growDiv.style.height = wrapper.clientHeight + "px";
    }
  }

  /**
   * Rendering Methods
   *
   */
  getTitleHeader() {
    return <header class="title">
      <a class="button close" onClick={this.onExitClick.bind(this)}>
        <span class="icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-down" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M3.5 10a.5.5 0 0 1-.5-.5v-8a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 0 0 1h2A1.5 1.5 0 0 0 14 9.5v-8A1.5 1.5 0 0 0 12.5 0h-9A1.5 1.5 0 0 0 2 1.5v8A1.5 1.5 0 0 0 3.5 11h2a.5.5 0 0 0 0-1h-2z" />
            <path fill-rule="evenodd" d="M7.646 15.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 14.293V5.5a.5.5 0 0 0-1 0v8.793l-2.146-2.147a.5.5 0 0 0-.708.708l3 3z" />
          </svg>
        </span>
      </a>
      <h3>{limit(this.title, 100)}</h3>
      <a class="button more" onClick={this.onMoreClick.bind(this)}>
        <span class="icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-three-dots" viewBox="0 0 16 16">
            <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
          </svg>
        </span>
      </a>
    </header>
  }

  getMetricsHeader() {
    return <div part="head" class="metrics">
      <d2-metric name="sentiment" />
      <d2-metric name="effort" />
      <d2-metric name="contributors" />
      <d2-metric name="citations" />
      <d2-metric name="fallacies" />
    </div>
  }

  getSubtitleHeader(slide) {
    const lastPage = this.getPageId(this.slides[this.slides.length - 2].page);
    const title = slide.title || (slide.leaf ? 'Leaf' : 'Node') + this.getPageId(slide.page)
    return <header part="head" class="nav-header">
      <a onClick={this.onBackClick.bind(this)} class="button back">
        <span class="icon">
          <svg xmlns="http://www.w3.org/2000/svg" class="bi bi-chevron-left">
            <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z" />
          </svg>
        </span>
        <span>{lastPage}</span>
      </a>
      <div>
        <h4>{title}</h4>
      </div>
      <div></div>
    </header>
  }

  getEditingToolbar() {
    return <header class="edit-actions remove">
      <div class="icon-btn" onClick={this.onCancelEditClick.bind(this)}>
        <div class="icon-btn-icon">
          <span>&times;</span>
        </div>
        <label>Cancel</label>
      </div>
      <div class="spacer"></div>
      <div class="spacer"></div>
      <div class="icon-btn" onClick={this.onDoneClick.bind(this)}>
        <div class="icon-btn-icon">
          <span>&#x2713;</span>
        </div>
        <label>Done</label>
      </div>
    </header>
  }

  getActionsToolbar() {
    return <div class="actions-toolbar">
      <header class="measuring-wrapper">
      <div></div>
      <div class="circle-btn-group">
        <button onClick={this.onFeaturePending.bind(this)} class="circle-btn">
          <div class="circle">
            <span>&#8800;</span>
          </div>
          <label>Fallacy</label>
        </button>
        <div class="spacer"></div>
        <button onClick={this.onEditClick.bind(this)} class="circle-btn">
          <div class="circle">
            <span>&#x270E;</span>
          </div>
          <label>Edit</label>
        </button>
        <div class="spacer"></div>
        <button onClick={this.onFeaturePending.bind(this)} class="circle-btn">
          <div class="circle">
            <span>&#x24;</span>
          </div>
          <label>Nudge</label>
        </button>
      </div>
      <div></div>
    </header>
    </div>
  }

  renderPara(text: string) {
    // console.log('renderPara', text);
    return text.split(/(\[[suoprteclink]+:\d+\])/).map(txt => {
      let m = txt.match(/^\[(support|source|link):(\d+)\]$/);
      if (!m) {
        return txt || '';
      } else {
        let id = m[2];
        if (m[1] === 'support') {
          return (
            <span>
              <a onClick={() => this.onExpandClick(id)} class="button next">
                <span class="pg-id">{id}</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-chevron-right">
                  <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
                </svg>
              </a>
              {touchSupported() && (
                <span class="float-touch">
                  <svg xmlns="http://www.w3.org/2000/svg" class="forward-circle" width="50" height="50">
                    <circle cx="25" cy="25" r="20" fill-opacity="0.1" onClick={() => this.onExpandClick(id)}>
                      {id}
                    </circle>
                  </svg>
                </span>
              )}
            </span>
          );
        } else if (m[1] === 'source') {
          return (
            <span>
              <sup>
                <a onClick={() => this.onInfoClick(id)} class="button brackets info">
                  {id}
                </a>
              </sup>
              {touchSupported() && (
                <span class="float-touch">
                  <svg xmlns="http://www.w3.org/2000/svg" class="info-circle" width="50" height="50">
                    <circle cx="25" cy="25" r="20" fill-opacity="0.1" onClick={() => this.onInfoClick(id)}>
                      {id}
                    </circle>
                  </svg>
                </span>
              )}
            </span>
          );
        } else if (m[1] === 'link') {
          return (
            <span>
              <a onClick={() => this.onEmptyLinkClick()} class="button next">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-link">
                  <path d="M6.354 5.5H4a3 3 0 0 0 0 6h3a3 3 0 0 0 2.83-4H9c-.086 0-.17.01-.25.031A2 2 0 0 1 7 10.5H4a2 2 0 1 1 0-4h1.535c.218-.376.495-.714.82-1z" />
                  <path d="M9 5.5a3 3 0 0 0-2.83 4h1.098A2 2 0 0 1 9 6.5h3a2 2 0 1 1 0 4h-1.535a4.02 4.02 0 0 1-.82 1H12a3 3 0 1 0 0-6H9z" />
                </svg>
              </a>
            </span>
          );
        } else {
          return m[0];
        }
      }
    });
  }

  renderSlide(slide: IArgument, index: number) {
    console.log('renderSlide', slide, index)
    return (
      <div class="swiper-slide">
        {index === 0 ? this.getMetricsHeader() : this.getSubtitleHeader(slide)}
        {this.getEditingToolbar()}
        <section part="main" class="main">
          {this.edit || slide.text.map(txt => <p>{this.renderPara(txt.p)}</p>)}
          {this.edit && <textarea>{slide.text.map(txt => txt.p + '\n\n')}</textarea>}
        </section>
        <br />
        <br />
      </div>
    );
  }

  render() {
    // console.log('render()', page === '1');
    if (!this.current) {
      return (
        <Host>
          <br />
          <br />
          <br />
          <br />
          <div class="file-input">
            <input id="data-url" ref={elm => (this.fileInputEl = elm as HTMLInputElement)} onChange={this.onFileInputChange.bind(this)} type="file" size={10}></input>
          </div>
        </Host>
      );
    }
    return (
      <Host>
        {this.getTitleHeader()}
        {this.getActionsToolbar()}
        <div class="swiper-container">
          <div class="swiper-wrapper">{this.slides.map((slide, x) => this.renderSlide(slide, x))}</div>
        </div>
        <d2-sources sources={this.sources}></d2-sources>
        <d2-tree id="outline-panel" class="remove" data={this.innerData} current="1"></d2-tree>
      </Host>
    );
  }
}
