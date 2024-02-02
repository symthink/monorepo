import { Component, Element, Host, h, State } from '@stencil/core';
import { Swiper, SwiperOptions } from 'swiper';
import { FallacyList, ILogicalFallacy } from './fallacies';
import { chunk } from '../../helpers/utils';



@Component({
  tag: 'd2-fallacy-kb',
  styleUrl: 'd2-fallacy-kb.css',
  shadow: true,
})
export class D2FallacyKb {
  @Element() el: HTMLElement;

  @State() selected: ILogicalFallacy = null;

  private swiperOpts: SwiperOptions = {};
  private swiper: Swiper;
  private fallacyList: Array<ILogicalFallacy[]>;
  private titleEl: HTMLElement;
  private descrEl: HTMLElement;
  private swiperCtrEl: HTMLElement;
  private backBtn: HTMLIonButtonElement;
  private alltagsBtn: HTMLButtonElement;
  private moreBtn: HTMLIonButtonElement;


  constructor() {
    this.fallacyList = chunk(FallacyList, 5);
    // this.onSlideNextTransitionEnd = this.onSlideNextTransitionEnd.bind(this);
    // this.onSlidePrevTransitionEnd = this.onSlidePrevTransitionEnd.bind(this);
  }

  initSwiper() {
    if (!this.swiper) {
      this.swiperOpts = {
        slidesPerView: 1,
        keyboard: {
          enabled: true,
        }
      };
      this.swiper = new Swiper(this.swiperCtrEl, this.swiperOpts);
      // this.swiper.on('slidePrevTransitionEnd', this.onSlidePrevTransitionEnd);
      // this.swiper.on('slideNextTransitionEnd', this.onSlideNextTransitionEnd);
    }
  }

  // onSlidePrevTransitionEnd() {
  // }
  // onSlideNextTransitionEnd() {
  // }

  componentDidRender() {
    console.log('componentDidRender()');
    if (!this.swiperCtrEl) {
      this.swiperCtrEl = this.el.shadowRoot.querySelector('.swiper-container') as HTMLElement;
    }
    this.initSwiper();
    console.log('swiper.update()')
    this.swiper.update();

    if (!this.alltagsBtn) {
      this.alltagsBtn = this.el.shadowRoot.querySelector('#alltags-btn');
    }
    if (!this.backBtn) {
      this.backBtn = this.el.shadowRoot.querySelector('#back-btn');
    }
    if (!this.moreBtn) {
      this.moreBtn = this.el.shadowRoot.querySelector('#more-btn');
    }
    this.updateButtonStates();     
  }

  updateButtonStates() {
    if (this.swiper) {
      if (this.swiper.isBeginning) {
        console.log('isBeg')
        this.alltagsBtn.style.display = 'inline-block';
        this.backBtn.style.display = 'none';
      } else {
        console.log('not beg')
        this.alltagsBtn.style.display = 'none';
        this.backBtn.style.display = 'inline-block';
      } 
      if (this.swiper.isEnd) {
        this.moreBtn.disabled = true;
      } else {
        this.moreBtn.disabled = false;
      }
    }
  }

  showHideFallacyKeys() {
    const growDiv = this.el.shadowRoot.querySelector('.fallacy-keys') as HTMLElement;
    if (growDiv.clientHeight) {
      growDiv.style.height = '0';
    } else {
      var wrapper = this.el.shadowRoot.querySelector('.measuring-wrapper');
      growDiv.style.height = wrapper.clientHeight + "px";
    }
  }

  onChipClick(fallacy: ILogicalFallacy) {
    if (this.selected && this.selected.tag === fallacy.tag) {
      // ??
    } else {
      this.selected = fallacy;
      this.titleEl = this.el.shadowRoot.querySelector('#title');
      this.descrEl = this.el.shadowRoot.querySelector('#descr');
      this.titleEl.innerHTML = this.nameTransform();
      this.descrEl.innerHTML = this.selected.descr;
    }
    this.showHideFallacyKeys();
  }

  onBackClick() {
    this.swiper.slidePrev();
    this.swiper.update();
    this.updateButtonStates();
  }

  onMoreClick() {
    this.swiper.slideNext();
    this.swiper.update();
    this.updateButtonStates();
  }

  videoURL(url: string) {
    return url;//this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  nameTransform() {
    if (this.selected) {
      return this.selected.name.replace(/\[([^\]]+)\]/g, '$1') + '&nbsp;(' + this.selected.tag + ')';
      // return this.selected.name.replace(/\[([^\]]+)\]/g, '<b>$1</b>') + '&nbsp;(' + this.selected.tag + ')';
    } else {
      return '';
    }
  }

  //ion-content  scrollX={true} scrollY={false}
  render() {
    return (
      <Host>
        <ion-header>
          <ion-toolbar class="toolbar-top">
            <ion-text id="title" slot="start">Fallacy Tags</ion-text>
          </ion-toolbar>
          <ion-toolbar class="toolbar-mid">
            <ion-text id="descr">Select a tag to see the definition and examples.</ion-text>
          </ion-toolbar>
        </ion-header>
        <ion-content scrollX={true} scrollY={false}>
          <div class="swiper-container">
            <div class="swiper-wrapper">
              {this.selected && this.selected.eg.map(eg =>
                <div class="swiper-slide" style={{ textAlign: eg.video ? 'center' : 'left' }}>
                  {eg.text && [<h4>Example:</h4>, <div innerHTML={eg.text}></div>]}
                  {eg.video && <iframe height="140" src={eg.video} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen={true}></iframe>}
                </div>
              )}
            </div>
            <ion-toolbar class="eg-toolbar">
              <ion-buttons slot="start">
                <button class="eg-nav-button icon-text-btn" id="alltags-btn" onClick={() => this.showHideFallacyKeys()}>
                  <ion-icon name="chevron-up-outline"></ion-icon><br />
                  <ion-label>All Tags</ion-label>
                </button>
                <ion-button class="eg-nav-button" id="back-btn" onClick={this.onBackClick.bind(this)}>
                  <ion-icon slot="start" name="chevron-back"></ion-icon>
                  <ion-label>Back</ion-label>
                </ion-button>
              </ion-buttons>
              <ion-buttons>
                <ion-button fill="solid" class="middle-btn">
                  <ion-label>Tag it</ion-label>
                  <ion-icon slot="end" name="pricetag-outline"></ion-icon>
                </ion-button>
              </ion-buttons>
              <ion-buttons slot="end">
                <ion-button class="eg-nav-button" id="more-btn" onClick={this.onMoreClick.bind(this)}>
                  <ion-label>More</ion-label>
                  <ion-icon slot="end" name="chevron-forward"></ion-icon>
                </ion-button>
              </ion-buttons>
            </ion-toolbar>
          </div>
          <div class="fallacy-keys">
            <div class="measuring-wrapper">
              <table>
              {this.fallacyList.map(row => 
                <tr>
                  {row.map( fallacy => <td><ion-chip outline={!this.selected || this.selected.tag !== fallacy.tag} onClick={this.onChipClick.bind(this, fallacy)}>{fallacy.tag}</ion-chip></td>)}
                </tr>
              )}
              </table>
            </div>
          </div>
        </ion-content>

      </Host>
    );
  }

}
