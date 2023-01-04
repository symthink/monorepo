import { createStore } from "@stencil/store";
import { ARG_LABEL } from '../../core/interfaces';

export interface ILearnSelectData {
    tag: ARG_LABEL;
    name: string;
    descr: string;
    rank: number;
    eg: {
      video?: any;
      text?: string;
    }[];
    ph: {
      p1: string;
      p2: string;
      p3: string;
    }
  }

export interface ILearnSelectState {
    listName: string;
    instruction: string;
    selectedTag?: string;
    dataList?: ILearnSelectData[];
    open?: boolean;
}

// initialize the reactive state map
export const LSStore = createStore<ILearnSelectState>({
    listName: '[title]',
    instruction: '[instruction]',
    selectedTag: null,
    dataList: [],
    open: false,
});

export const { state, onChange } = LSStore;

export const LSStateHandlerResets = [];