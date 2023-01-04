import { Component, h, Prop, Method, State, Event, EventEmitter } from '@stencil/core';
// import { modalController } from '@ionic/core';
import { ILearnSelectState, state, LSStore } from './shared-state';
import { D2LearnSelect } from './d2-learn-select';
import { BehaviorSubject } from 'rxjs';
import { ILearnSelectData, LSStateHandlerResets } from './shared-state';
import { ARG_LABEL } from '../../core/interfaces';
import { OverlayEventDetail } from '@ionic/core';

@Component({
  tag: 'd2-learn-select-modal',
  styleUrl: 'd2-learn-select-modal.scss',
  shadow: false,
})
export class D2LearnSelectModal {

    @State() open = false;

    @Event() d2LearnSelectModalDidDismiss: EventEmitter<ILearnSelectData>;

  private learnSelectEl: D2LearnSelect;
  private modalEl: HTMLIonModalElement;

  @Method()
  async present(lsData: ILearnSelectState, selected: ARG_LABEL) {
    console.log('D2learnSelectModal.present() list:', lsData.dataList.length);
    // validate ?
    // LSStore.reset();
    state.listName = lsData.listName;
    state.instruction = lsData.instruction;
    state.dataList = lsData.dataList;
    state.selectedTag = selected || null;  
    this.modalEl.onDidDismiss().then((evDetail: OverlayEventDetail<any>) => {
        state.open = this.open = false;
        this.d2LearnSelectModalDidDismiss.emit(evDetail.data)
        LSStateHandlerResets.map( reset => reset());
        LSStateHandlerResets.length = 0;    
    });
    state.open = this.open = true;
    LSStore.forceUpdate('open');
  }

  @Prop() selectionChange$: BehaviorSubject<ILearnSelectData>;

  componentDidLoad() {
    this.selectionChange$ = this.learnSelectEl.selectionChange$;
    LSStore.forceUpdate('open');
  }

  render() {
    return (
      <ion-modal isOpen={this.open} class="d2-learn-select-modal" breakpoints={[0, 0.4, 1]} initialBreakpoint={1}
        ref={(el) => (this.modalEl = el as HTMLIonModalElement)}>
        <d2-learn-select 
            ref={(el) => (this.learnSelectEl = el as any)}/>
      </ion-modal>
    );
  }
}
