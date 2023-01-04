import {
  Component,
  h,
  State,
  Element,
  Event,
  EventEmitter,
} from '@stencil/core';
import {
  ILearnSelectData,
  state,
  onChange,
  LSStateHandlerResets,
} from './shared-state';

@Component({
  tag: 'd2-learn-select-content',
  shadow: false,
})
export class D2LearnSelectContent {
  @Element() el: HTMLElement;

  @State() chunkedList: Array<ILearnSelectData[]> = [];
  @Event() slidesDidChange: EventEmitter<void>;

  componentWillLoad() {
    console.log('learn-select-content componentWillLoad()');
    const reset = onChange('open', () => this.setChunkedList());
    LSStateHandlerResets.push(reset);
  }

  async setChunkedList() {
    this.chunkedList = this.chunk(state.dataList, 5);
  }

  chunk(arr: Array<any>, size: number) {
    return Array.from({ length: Math.ceil(arr.length / size) }, (_v, i) =>
      arr.slice(i * size, i * size + size)
    );
  }

  componentDidRender() {
    if (state.selectedTag) {
      this.slidesDidChange.emit();
    }
    if (this.chunkedList.length === 0 && state.dataList.length > 0) {
      this.setChunkedList();
    }
  }

  render() {
    return [
      <div class="swiper-slide">
        <br />
        <div class="chip-container">
          <table>
            {this.chunkedList.map((row) => (
              <tr>
                {row.map((item) => (
                  <td>
                    <ion-chip
                      outline={state.selectedTag !== item.tag}
                      onClick={() => (state.selectedTag = item.tag)}
                    >
                      {item.tag}
                    </ion-chip>
                  </td>
                ))}
              </tr>
            ))}
          </table>
        </div>
      </div>,
      <ExampleSlides />,
    ];
  }
}

const ExampleSlides = () => {
  if (state.selectedTag) {
    const selected = state.dataList.find((i) => i.tag === state.selectedTag);
    if (selected) {
      return selected.eg.map((eg) => (
        <div
          class="swiper-slide"
          style={{ textAlign: eg.video ? 'center' : 'left' }}
        >
          {eg.text && [<h4>Example:</h4>, <div innerHTML={eg.text}></div>]}
          {eg.video && (
            <iframe
              height="140"
              src={eg.video}
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen={true}
            ></iframe>
          )}
        </div>
      ));
    }
  }
  return <div class="swiper-slide">No examples available</div>;
};
