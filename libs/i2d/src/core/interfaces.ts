import { ILearnSelectData } from '../components/d2-learn-select/shared-state';

export enum REF_LABEL {
    Person = 'Person',
    Website = 'Website',
    Print = 'Print',
    Radio = 'Radio',
    TV = 'TV',
}

export interface IReference {
    id: string;
    label: REF_LABEL;
    url?: URL;
    name?: string;
    publisher?: string;
}

export enum ARG_LABEL {
    Question = 'QUE',
    Claim = 'CLM',
    Idea = 'IDA',
    Event = 'EVT',
    SourceList = 'SRC',
}


// everything below the top level
export interface IArgumentSub {
    id: string;
    title?: string;
    sym?: URL; //URL path to JSON of connected argument
    text?: IText[];
    label: ARG_LABEL; // default to Statement ?
    cardType?: ILearnSelectData;
    links?: IArgumentSub[];
    // properties created on load
    page?: number[]; // index path to this arg e.g. [0,3,2,0]
    leaf?: boolean; // has no linked args
}

export interface IText {
    p: string;
}

// TODO: use typedocs w/mermaidjs plugin to express relationships between these interfaces
// see: https://www.npmjs.com/package/typedoc-plugin-mermaid
// Top level
export interface IArgument extends IArgumentSub {
    author?: string;
    posted?: Date;
    modified?: Date;
    sources?: IReference[];
}

export enum CAB {
    Edit = 'Edit',
    TagFallacy = 'Fallacy',
    Pay = 'Nudge',
    Link = 'Link'
}
