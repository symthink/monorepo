import {
  Component,
  h,
  Prop,
  Host,
  Event,
  EventEmitter,
  Element,
  Listen,
} from '@stencil/core';
import { BehaviorSubject } from 'rxjs';
import { Swiper, SwiperOptions } from 'swiper';
import {
  ILearnSelectData,
  state,
  onChange,
  LSStateHandlerResets
} from './shared-state';
import './d2-learn-select-content';

@Component({
  tag: 'd2-learn-select',
  styleUrl: 'd2-learn-select.scss',
  shadow: true,
})
export class D2LearnSelect {
  @Element() el: HTMLElement;

  @Event() selectChange: EventEmitter<string>;
  @Event() lsChoiceChange: EventEmitter<ILearnSelectData>;

  private selected: ILearnSelectData = null;
  private titleEl: HTMLElement;
  private descrEl: HTMLElement;
  private footerToolbarEl: HTMLElement;
  private backBtn: HTMLIonButtonElement;
  private allBtn: HTMLIonButtonElement;
  private moreBtn: HTMLIonButtonElement;
  private swiperOpts: SwiperOptions = {};
  private swiper: Swiper;
  private swiperCtrEl: HTMLElement;

  @Listen('slidesDidChange')
  onSlidesDidChange() {
    this.initSwiper();
    if (this.swiper) {
      this.swiper.update();
    }
  }

  @Prop() selectionChange$: BehaviorSubject<ILearnSelectData>;

  async componentWillLoad() {
    console.log('learn-select componentWillLoad()')
    const reset = onChange('selectedTag', this.onSelectedTagChange.bind(this));
    // LSStateHandlerResets.push(reset);
  }

  componentDidLoad() {
    this.initSwiper();
    // console.log('D2learnSelect.componentDidLoad()');
    const modalEl = this.el.closest('ion-modal');
    modalEl.addEventListener('willPresent', () => {
      this.updateButtonStates()
    });

    this.selectionChange$ = new BehaviorSubject(null);
  }



  nameTransform() {
    if (this.selected) {
      return (
        this.selected.name.replace(/\[([^\]]+)\]/g, '$1') +
        '&nbsp;(' +
        this.selected.tag +
        ')'
      );
    } else {
      return '';
    }
  }

  onSelectedTagChange() {
    console.log('onSelectedTagChange', state.selectedTag)
    const sel = state.dataList.find((i) => i.tag === state.selectedTag);
    if (sel) {
      this.initSwiper();
      this.selected = sel;
      this.titleEl.innerHTML = this.nameTransform();
      this.descrEl.innerHTML = this.selected.descr;
      this.updateButtonStates();
      this.selectionChange$.next(sel);
    }
  }

  showHideEgToolbar() {
    if (this.selected?.eg?.length) {
      console.log('remove hidden')
      this.footerToolbarEl.classList.remove('hidden');
    } else {
      console.log('add hidden')
      this.footerToolbarEl.classList.add('hidden');
    }
  }

  updateButtonStates() {
    console.log('updateButtonStates', this.swiper, state.selectedTag)
    if (this.swiper) {
      this.showHideEgToolbar();
      if (!state.selectedTag) {
        // this.backBtn.disabled = true;
        // this.moreBtn.disabled = true;
        // this.allBtn.disabled = true;
      } else {
        if (this.swiper.isBeginning) {
          this.allBtn.disabled = true;
          this.backBtn.disabled = true;
          this.moreBtn.disabled = false;
        } else if (this.swiper.isEnd) {
          this.allBtn.disabled = false;
          this.backBtn.disabled = false;
          this.moreBtn.disabled = true;
        } else {
          this.allBtn.disabled = false;
          this.backBtn.disabled = false;
          this.moreBtn.disabled = false;
        }
      }
      // this.backBtn.style.display = 'inline-block';
    } else if (this.allBtn && this.moreBtn && this.backBtn) {
      this.allBtn.disabled = true;
      this.backBtn.disabled = true;
      this.moreBtn.disabled = true;
    }
  }

  initSwiper() {
    console.log('initSwiper')
    if (!this.swiper) {
      if (!this.swiperCtrEl) {
        this.swiperCtrEl = this.el.shadowRoot.querySelector(
          '.swiper'
        ) as HTMLElement;
      }
      this.swiperOpts = {
        slidesPerView: 1,
      };
      this.swiper = new Swiper(this.swiperCtrEl, this.swiperOpts);
      // this.swiper.on('slidePrevTransitionEnd', this.onSlidePrevTransitionEnd);
      // this.swiper.on('slideNextTransitionEnd', this.onSlideNextTransitionEnd);
    }
  }

  onAllClick() {
    if (this.swiper) {
      this.swiper.slideTo(0);
      this.swiper.update();
      this.updateButtonStates();
    }
  }
  onBackClick() {
    if (this.swiper) {
      this.swiper.slidePrev();
      this.swiper.update();
      this.updateButtonStates();
    }
  }

  onMoreClick() {
    if (this.swiper) {
      this.swiper.slideNext();
      this.swiper.update();
      this.updateButtonStates();
    }
  }

  onChoiceClick() {
    if (state.selectedTag) {
      const selected = state.dataList.find((i) => i.tag === state.selectedTag);
      const modalEl = this.el.closest('ion-modal') as HTMLIonModalElement;
      modalEl.dismiss(selected);
    } else {
      // maybe alert 'chose first..'
    }
  }

  videoURL(url: string) {
    return url; //this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  render() {
    return (
      <Host>
        <ion-header>
          <ion-toolbar class="ion-text-center ion-text-wrap list-name-bar">
            <h1 ref={(el) => (this.titleEl = el as HTMLElement)}>
              {state.listName}
            </h1>
          </ion-toolbar>
        </ion-header>
        <ion-content fullscreen={true} scrollX={true} scrollY={false}>
          <ion-item lines="none" class="term-def">
            <ion-label
              class="ion-text-wrap"
              ref={(el) => (this.descrEl = el as HTMLElement)}
            >
              {state.instruction}
            </ion-label>
            <ion-icon slot="end"></ion-icon>
          </ion-item>
          <div class="swiper">
            <d2-learn-select-content class="swiper-wrapper" />
          </div>
          <ion-fab vertical="top" horizontal="end" edge slot="fixed">
            <ion-fab-button onClick={() => this.onChoiceClick()}>
              <ion-icon name="checkmark-outline"></ion-icon>
            </ion-fab-button>
          </ion-fab>
        </ion-content>
        <ion-footer >
          <ion-toolbar
          ref={(el) => (this.footerToolbarEl = el as HTMLElement)}>
            <ion-buttons slot="start">
              <ion-button
                class="eg-nav-button"
                onClick={this.onAllClick.bind(this)}
                ref={(el) => (this.allBtn = el as HTMLIonButtonElement)}
              >
                <ion-icon slot="start" class="vdash"></ion-icon>
                <ion-label>All</ion-label>
              </ion-button>
            </ion-buttons>
            <ion-buttons slot="end">
              <ion-button
                class="eg-nav-button"
                onClick={this.onBackClick.bind(this)}
                ref={(el) => (this.backBtn = el as HTMLIonButtonElement)}
              >
                <ion-icon slot="icon-only" name="chevron-back"></ion-icon>
              </ion-button>
              <ion-label>Examples</ion-label>
              <ion-button
                class="eg-nav-button"
                onClick={this.onMoreClick.bind(this)}
                ref={(el) => (this.moreBtn = el as HTMLIonButtonElement)}
              >
                <ion-icon slot="icon-only" name="chevron-forward"></ion-icon>
              </ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-footer>
      </Host>
    );
  }
}
