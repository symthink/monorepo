import { Subject } from 'rxjs';

const SCHEMA_VERSION = 1;// current

export enum REF_LABEL {
    Person = 'Person',
    Website = 'Website',
    Print = 'Print',
    Radio = 'Radio',
    TV = 'TV',
}

export enum FormatEnum {
    Default = 1,
    Review = 2, // puts 1st citation at top instead of byline
}

export interface IReference {
    id: string;
    label: REF_LABEL;
    url?: URL;
    name?: string;
    publisher?: string;
}

export enum ARG_TYPE {
    Question = 'QUE',
    Claim = 'CLM',
    Idea = 'IDA',
    Event = 'EVT',
    SourceList = 'SRC',
    Statement = 'STM'
}

export interface ISource {
    author: string;
    date: Date;
    publisher: string;
    title: string;
    url: URL;
    description?: string;
    image?: URL;
    logo?: URL;
}



// // everything below the top level
export interface ISymThink {
    id?: string;
    type: ARG_TYPE; // default to Question
    label?: string;
    text?: string;
    url?: string;
    support?: ISymThink[];
    source?: ISource[];
    lastSupIsConcl?: boolean;
    expires?: number; // for orphans only
    lastmod?: number;
    eventDate?: number; // UTC timestamp for Events only
    selected?: boolean;
    numeric?: boolean; // if true, use numbers instead of bullets for support icons
    decision?: IDecision;
    createdTime?: number;
    creator?: string;
    creatorId?: string;
}
export interface ISymThinkDocument extends ISymThink {
    $chemaver?: number;
    orphans?: ISymThink[];
    format?: FormatEnum;
    uid?: string; // collection/{uid} - firestore document ID
    timestamp?: any;
    decisions?: IDecision[];

    // metadata only for function onCreate copy to stmeta collection
    emails?: string[];
}

export interface IDecision {
    ts: string; // ISO timestamp
    scope: string; // admin level or null
    uri?: string; // if scoped, then point to location of symthink decision in scope
    // Later add props for e.g:
    // type?: string; // 
    // dueDate?: string;
    subscription?: string;// "|" separated path of: userId/symthinkDocId/nodeId
}
export enum StLogActionEnum {
    ADD_CHILD = 1,
    REMOVE_CHILD = 2,
    ADOPT_ORPHAN = 3,
    MAKE_ORPHAN = 4,
    REORDER = 5,
    EDIT = 6,
    EDIT2 = 7,
    ADD_SOURCE = 8,
}
// TODO: use typedocs w/mermaidjs plugin to express relationships between these interfaces
// see: https://www.npmjs.com/package/typedoc-plugin-mermaid
// Top level
// export interface ISymThinkRoot extends ISymThink {
//     author?: string;
//     posted?: Date;
//     modified?: Date;
//     sources?: IReference[];
// }

export class SymThink {
    id: string;
    type: ARG_TYPE = ARG_TYPE.Question;
    // 1-2 words, max 40 chars? for outline or mind map displays
    label: string;
    text: string;
    // A fully qualified URL to public Symthink document
    // https://symthink.io/n/SOMEID#nodeId
    url: URL;
    support: SymThink[];
    source: ISource[];
    parent: SymThink = null;
    checked = false; // for edit mode Extend/Trim options
    active = false;
    lastmod: number;
    lastSupIsConcl = false;
    eventDate: Date; // for Events only
    sup$ = new Subject<boolean>();// true = for adding child, false for removing
    select$ = new Subject<boolean>();
    mod$ = new Subject<void>();
    selected = false;
    numeric = false;
    decision: IDecision;
    createdTime: number;
    creator: string; // display name
    creatorId: string;

    constructor(id: string, parent?: SymThink) {
        // make read-only after first set
        const theId = id || Math.random().toString(36).substring(2, 9);
        Object.defineProperty(this, 'id', {
            writable: false,
            value: theId
        });
        if (parent) {
            this.parent = parent;
        }
        this.select$.subscribe(v => v ? this.onSelect() : this.selected = false);
    }

    onSelect() {
        if (this.hasKids()) {
            this.support.map(k => k.selected = false);
        }
        let card: SymThink = this.parent;
        while (card) {
            card.selected = false;
            if (card.hasKids()) {
                card.support.map(k => k.selected = false);
            }
            card = card.parent;
        }
        this.selected = true;
    }

    get isEvent(): boolean { return this.type === ARG_TYPE.Event; }
    get isSource(): boolean { return this.type === ARG_TYPE.SourceList; }
    get isClaim(): boolean { return this.type === ARG_TYPE.Claim; }

    apply(arg: ISymThink) {
        this.selected = arg.selected || false;
        this.type = arg.type || undefined;
        this.label = arg.label || undefined;
        this.text = arg.text || undefined;
        this.numeric = arg.numeric || undefined;
        this.decision = arg.decision || undefined;
        this.createdTime = arg.createdTime || (new Date()).getTime();
        this.creator = arg.creator || undefined;
        this.creatorId = arg.creatorId || undefined;
        this.lastSupIsConcl = !!arg.lastSupIsConcl;
        this.lastmod = arg.lastmod || undefined;
        if (arg.eventDate) {
            try {
                this.eventDate = new Date(arg.eventDate * 1000);
            } catch (e) {
                console.debug(e);
            }
        }
        if (arg.support) {
            this.support = [];
            arg.support.map((a) => this.addChild(a, false));
        }
        if (arg.source) {
            this.source = arg.source.map(s => {
                const cp = { ...s } as any;
                try { cp.url = new URL(s.url) } catch (e) { }
                try { cp.date = new Date(s.date) } catch (e) { }
                return cp;
            });
        }
        if (arg.url) {            
            try { this.url = new URL(arg.url) } catch (e) { console.log('Invalid URL:', e) }
        }
    }

    genId() { return Math.random().toString(36).substring(2, 9); }

    addChild(card?: ISymThink, doLog = true) {
        if (!this.isKidEnabled()) {
            throw new Error(`This item(${this.id}) is not child enabled`);
        }

        let symthink = new SymThink(card?.id || this.genId(), this);
        symthink.apply(card);
        this.support.push(symthink);
        this.sup$.next(true);
        if (doLog) {
            this.logAction(StLogActionEnum.ADD_CHILD);
        }
        return this.support[this.support.length - 1];
    }

    updateLastModTime() {
        this.lastmod = Math.floor(new Date().getTime() / 1000);
    }

    hasSources(): boolean {
        return !!(this.source && this.source.length);
    }

    addSource(src: ISource) {
        if (!this.hasSources()) {
            this.source = [];
        }
        this.source.push(src);
        // this.enableKids();  ???
        this.logAction(StLogActionEnum.ADD_SOURCE);
    }

    getShowableSources(): {id: string, src: ISource}[] {
        let srcList = [];
        if (this.hasSources()) {
            srcList = [...this.source].map((src) => {
                return {
                    id: this.id,
                    src: src 
                };
            }); 
        }
        if (this.hasKids()) {
            this.support.forEach((s) => {
                if (s.hasSources()) {
                    const list = [...s.source].map((sc) => {
                        return {
                            id: s.id,
                            src: sc 
                        };
                    });
                    srcList.concat(list);
                }
            });
        }
        return srcList
    }

    hasKids(): boolean {
        return !!(this.support && this.support.length);
    }

    isKidEnabled() {
        return !!this.support;
    }

    maxKids(): boolean {
        return this.support?.length >= 9;
    }

    enableKids(): boolean {
        if (!this.support) {
            this.support = [];
            return true;
        }
        return false;
    }

    canDisable() {
        return !this.hasKids() && this.isKidEnabled();
    }

    disableKids() {
        if (this.hasKids()) {
            return false;
        }
        this.support = undefined;
        this.label = null;
        return true;
    }

    // getClickPath() {
    //     let card: SymThink = { ...this };
    //     card.active = true;
    //     const path = [card];
    //     while (card.parent) {
    //         card = card.parent;
    //         card.active = false;
    //         path.unshift(card);
    //     }
    //     return path;
    // }

    findChild(id: string) {
        return this.support.find((c) => c.id === id);
    }

    find(callback: Function): SymThink {
        if (callback(this)) return this;
        if (this.hasKids()) {
            for (let card of this.support) {
                const c = card.find(callback.bind(card));
                if (c) return c;
            }
        }
        return undefined;
    }
    getRoot() {
        let card: SymThink = this;
        while (card.parent) {
            card = card.parent;
        }
        return card as SymThinkDocument;
    }
    getPageIDs() {
        let card: SymThink = this;
        const IDs = [];
        if (card.hasKids()) {
            card.support.map(s => IDs.push(s.id));
        }
        IDs.unshift(card.id);
        return IDs;
    }
    getRaw(deep = true): ISymThink {
        const o: ISymThink = {
            id: this.id,
            type: this.type,
            text: this.text,
            label: this.label,
            eventDate: this.eventDate ? Math.floor(this.eventDate.getTime() / 1000) : undefined,
            support: undefined,
            source: undefined,
            decision: this.decision ? { ...this.decision } : null,
            createdTime: this.createdTime || undefined,
            creator: this.creator || undefined,
            creatorId: this.creatorId || undefined,
            lastSupIsConcl: !!this.lastSupIsConcl,
            numeric: this.numeric || undefined,
            url: this.url ? this.url.toString() : undefined,
        };
        console.log('source', this.source)
        if (this.source) {
            o.source = this.source.map(s => {
                const cp = { ...s } as any;
                try { cp.url = s.url.toString() } catch (e) { }
                try { cp.date = s.date.toString() } catch (e) { }
                return cp;
            });
            console.log('o.source', o.source)
        }
        if (deep && this.support) {
            o.support = this.support.map((a) => a.getRaw(a.hasKids()));
        }
        return o;
    }
    /** Returns the character length of the card */
    textLen() {
        return 0;// fix this
        // return (this.text?.length || 0) + this.support.map(o => o.text?.length || 0).reduce(
        //     (prevValue, curValue) => prevValue + curValue, 0) || 0;
    }
    /** WHY ??? */
    count(): number {
        let n = 0;//this.textLen() > 50 ? 1 : 0;
        if (this.support && this.support.length) {
            for (let card of this.support) {
                n = n + card.count();
            }
        }
        return n;
    }
    countDecendents(type?: ARG_TYPE): number {
        let n = 0;
        if (this.support && this.support.length) {
            for (let card of this.support) {
                if (card.hasItemText()) {
                    if (type) {
                        if (type === card.type) {
                            n++;
                        }
                    } else {
                        n++;
                    }
                }
            }
            for (let card of this.support) {
                n = n + card.countDecendents(type);
            }
        }
        return n;
    }
    countSources() {
        let n = this.source?.length || 0;
        if (this.support && this.support.length) {
            for (let card of this.support) {
                n = n + card.countSources();
            }
        }
        return n;
    }

    getDepth(level = 0, depth = 0) {
        if (depth < level) {
            ++depth;
        }
        if (this.support?.length) {
            for (let card of this.support) {
                ++level;
                const { lev, dep } = card.getDepth(level, depth);
                level = lev;
                depth = dep;
                --level;
            }
        }
        return { lev: level, dep: depth };
    }

    get flatJson(): ISymThink {
        return this.getRaw(false);
    }
    removeChild(card: SymThink): SymThink {
        const index = this.support.findIndex(c => c.id === card.id);
        console.log('index', index)
        if (index !== -1) {
            this.logAction(StLogActionEnum.REMOVE_CHILD);
            return this.support.splice(index, 1)[0];
        }
    }
    makeOrphan(expires?: number): boolean {
        const parent = this.parent;
        const baseCard = this.getRoot();
        const removed = parent.removeChild(this);
        if (removed) {
            const orphan = removed.getRaw(true);
            const expirationDate = new Date();
            orphan.expires = expires || expirationDate.setDate(expirationDate.getDate() + 7);
            baseCard.orphans.push(orphan);
            this.logAction(StLogActionEnum.MAKE_ORPHAN);
            return true;
        }
        return false;
    }
    orphanizeKids() {
        const baseCard = this.getRoot();
        let child = this.support.pop();
        let did = false;
        while (child) {
            const orphan = child.getRaw(true);
            const expirationDate = new Date();
            orphan.expires = expirationDate.setDate(expirationDate.getDate() + 7);
            baseCard.orphans.push(orphan);
            did = true;
            child = this.support.pop();
        }
        if (did) {
            this.logAction(StLogActionEnum.MAKE_ORPHAN);
        }
    }
    adoptOrphan(id: string) {
        const baseCard = this.getRoot();
        const orphanX = baseCard.orphans.findIndex(o => o.id === id);
        if (orphanX !== -1) {
            this.logAction(StLogActionEnum.ADOPT_ORPHAN);
            const orphan = baseCard.orphans.splice(orphanX, orphanX + 1)[0];
            delete orphan.id; // to generate new id
            this.enableKids();
            return this.addChild(orphan);
        }
    }

    singleLine(): boolean {
        const a = this.getSupportItemText();
        return a ? a.length < 25 : false;
    }
    // text property showing as a support
    getSupportItemText() {
        return this.isKidEnabled() ?
            (this.label || this.text || null) :
            (this.text || this.label || null);
    }
    // text property showing at the top
    getCurrentItemText() {
        return this.text || this.label || null;
    }
    hasItemText(): boolean {
        return !!(this.text || this.label || null);
    }
    logAction(action: StLogActionEnum) {
        const doc = this.getRoot();
        if (doc.log$) {
            doc.log$.next({ action, ts: (new Date()).getTime() })
        }
    }

    get isRoot() { return !this.parent }

    get shortText() {
        if (this.label) {
            return this.label;
        }
        else if (/^[^:]+:/.test(this.text)) {
            let parts = this.text.split(':');
            return parts.shift();
        }
        else {
            return this.text || ' ';
        }
    }

    shallowCopy() {
        const a = {
            t: this.text,
            c: '',
            n: this.numeric,
            s: this.hasKids() ? this.support.map(sp => sp.text) : []
        };
        if (this.lastSupIsConcl) {
            a.c = a.s.pop();
        }
        return a;
    }

    textPage() {
        let bullts = [];
        let conclusion = '';
        if (this.hasKids()) {
            bullts = this.support.map(blt => blt.text);
            if (this.lastSupIsConcl) {
                conclusion = bullts.pop();
            }
            if (this.numeric) {
                for (let x = 0; x < bullts.length; x++) {
                    const b = Bullets.find((b) => x + 1 === b.x);
                    bullts[x] = `${b.full} ${bullts[x]}`;
                }
            } else {
                const pb = Bullets.find((b) => b.x === 0);
                bullts = bullts.map(itm => `${pb.full} ${itm}`);
            }

        }
        return `${this.text}
${bullts.join('\n')}
${conclusion}`;
    }

    // Disabled/overwrites any children
    subscribe(doc: SymThinkDocument) {
        if (!doc.url) {
            console.debug(doc);
            throw new Error('Cannot link doc without a url.');
        }
        this.support = undefined;
        this.text = doc.text;
        this.url = doc.url;
        this.createdTime = doc.createdTime;
        this.creator = doc.creator;
        this.creatorId = doc.creatorId;
        this.decision = doc.decision;
        // d2-rcard is represented by the parent
        if (this.parent) {
            this.parent.mod$.next();
        }
    }
}

// a.k.a root card
export class SymThinkDocument extends SymThink {
    $chemaver: number;
    // I think not used
    // $activePath: BehaviorSubject<SymThink[]>;
    orphans: ISymThink[] = [];
    log$: Subject<{ action: number, ts: number }>;
    format: FormatEnum = FormatEnum.Default;
    page$ = new Subject<string[]>();
    uid: string;
    timestamp: { seconds: number, nanoseconds: number };
    // eg. worldview doc will have many decisions on supports and we 
    // want to store a record of those decisions after completion
    decisions: IDecision[];

    // do this on the doc being subscribed to by another doc (the subscriber)
    addSubscriber(userUID: string, originDocUID: string, originNodeId: string) {
        const subscrID = `${userUID}/${originDocUID}/${originNodeId}`;
        if (this.decision.subscription) {
            const subs = this.decision.subscription.split('|');
            subs.push(subscrID);
            this.decision.subscription = subs.join('|');
        } else {
            this.decision.subscription = subscrID;
        }
    }

    // finding the subscribing item in the original doc
    getSubscriber(doc: SymThinkDocument) {
        if (this.decision?.subscription) {
            try {
                const subscriptions = this.decision.subscription.split('|');
                let id = null;
                for (let sub of subscriptions) {
                    const [_uid, docUid, itmId] = sub.split('/');
                    if (docUid === doc.uid) {
                        id = itmId;
                        break;
                    }
                }
                return doc.find((c) => c.id === id);
            } catch (e) {
                console.warn('getSubscriber()', e);
            }
        }
    }

    // return milliseconds
    get modifiedTime() {
        if (this.timestamp && this.timestamp.seconds) {
            return this.timestamp.seconds * 1000;
        } else if (this.lastmod) {
            return this.lastmod * 1000;
        }
        return null;
    }

    get title() {
        return this.label || this.text;
    }

    constructor(key?: string) {
        super(key);
    }

    load(arg: ISymThinkDocument) {
        // console.log('load', arg)
        // console.log('load() arg.$chemaver',arg.$chemaver)
        this.$chemaver = arg.$chemaver || SCHEMA_VERSION;
        this.orphans = arg.orphans || [];
        this.format = arg.format;
        this.uid = arg.uid;
        this.timestamp = arg.timestamp;
        if (arg.$chemaver < SCHEMA_VERSION) {
            console.log('Schema migrate from %s to %s', arg.$chemaver, SCHEMA_VERSION);
        }
        if (arg.decisions) {
            this.decisions = arg.decisions;
        }
        this.apply(arg);
    }

    getRawDoc(): ISymThinkDocument {
        const o: ISymThinkDocument = this.getRaw(true);
        o.$chemaver = SCHEMA_VERSION;
        o.format = this.format || FormatEnum.Default;
        o.orphans = this.orphans;
        o.decisions = this.decisions ? [...this.decisions] : null;
        o.uid = this.uid;
        o.timestamp = this.timestamp;
        return o;
    }

    enableLog(logger: any) {
        this.log$ = logger;
    }

    toString() {
        const raw = this.getRawDoc();
        return JSON.stringify(raw);
    }

    getOrphans() {
        // maybe add props here or convert to SymThink object?
        return this.orphans;
    }

    /** delete expired orphans */
    cleanup() {
        this.orphans = this.orphans.filter(o => (new Date()).getTime() <= o.expires);
    }

    deselect(): boolean {
        if (this.selected) {
            this.selected = false;
            return true;
        } else {
            const symthink = this.find((itm) => itm.selected);
            if (symthink) {
                symthink.selected = false;
                return true;
            }
        }
        return false;
    }

    getTotalNodes() {
        return this.countDecendents() + 1;
    }

    getTotalsByType() {
        return {
            questionCnt: this.countDecendents(ARG_TYPE.Question) + (this.type === ARG_TYPE.Question ? 1 : 0),
            claimCnt: this.countDecendents(ARG_TYPE.Claim) + (this.type === ARG_TYPE.Claim ? 1 : 0),
            ideaCnt: this.countDecendents(ARG_TYPE.Idea) + (this.type === ARG_TYPE.Idea ? 1 : 0),
        };
    }

    getTotalSources(): number {
        return this.countSources();
    }

    // getAllSources(): ISources[] {
    //     const start = this.source || [];
    //     const rs = this.support.reduce((prevVal, currVal, x, supp) => {
    //         if (currVal.source) {
    //             prevVal.push(...currVal.source);
    //         }
    //         if (currVal.support) {

    //         }

    //         return prevVal;
    //     }, start);
    // }

}
export interface ICardRules {
    type: ARG_TYPE;
    name: string;
    icon?: string;
    svg?: string;
    placeholder: string;
    supportsPh: string;
    conclPh: string;
    disable: string[];
    xtra: boolean;
    char: string;
    iconCls: string;
}
export const CardRules = [
    {
        type: ARG_TYPE.Question,
        name: 'Question',
        svg: '/assets/icon/questmark.svg',
        placeholder: 'Enter a question',
        supportsPh: 'Perhaps doing X would solve the problem💡',
        conclPh: 'Add background context',
        disable: [],
        xtra: false,
        char: '❓', // 2753
        iconCls: 'ico-ques',
        next: ARG_TYPE.Idea
    },
    {
        type: ARG_TYPE.Idea,
        name: 'Idea',
        icon: 'bulb',
        placeholder: 'Enter an idea',
        supportsPh: 'XYZ provide evidence to support the efficacy of the solution.',
        conclPh: 'Describe the problem it solves',
        disable: [],
        xtra: false,
        char: '💡', // 1f4a1
        iconCls: 'ico-bulb',
        next: ARG_TYPE.Claim
    },
    {
        type: ARG_TYPE.Claim,
        name: 'Claim',
        icon: 'megaphone',
        placeholder: 'Enter a claim',
        supportsPh: 'Additionally, XYZ provides more granular reasoning or supporting evidence.',
        conclPh: 'Conclusion, restate or summarize claim',
        disable: [],
        xtra: false,
        char: '🕫', // 1f56b
        iconCls: 'ico-clm',
        next: ARG_TYPE.Question
    },
    {
        type: ARG_TYPE.Statement,
        name: 'any text',
        icon: 'create-outline',
        placeholder: 'Enter an item',
        supportsPh: '',
        conclPh: '',
        disable: [],
        xtra: false,
        char: '',
        iconCls: null,
        next: ARG_TYPE.Statement
    }
];
export const trailingSympunkRegExp = /[🕫💡❓]+/g
export const sympunkReplacementRegex = /[^\.\!\?]*[\.\!\?🕫💡❓]/g;
export const Bullets = [
    { x: 0, circ: '⊙', full: '⚈', circle: '&#x2299;', fulle: '&#x2688;' },
    { x: 1, circ: '➀', full: '➊', circle: '&#x2780;', fulle: '&#x278A;' },
    { x: 2, circ: '➁', full: '➋', circle: '&#x2781;', fulle: '&#x278B;' },
    { x: 3, circ: '➂', full: '➌', circle: '&#x2782;', fulle: '&#x278C;' },
    { x: 4, circ: '➃', full: '➍', circle: '&#x2783;', fulle: '&#x278D;' },
    { x: 5, circ: '➄', full: '➎', circle: '&#x2784;', fulle: '&#x278E;' },
    { x: 6, circ: '➅', full: '➏', circle: '&#x2785;', fulle: '&#x278F;' },
    { x: 7, circ: '➆', full: '➐', circle: '&#x2786;', fulle: '&#x2790;' },
    { x: 8, circ: '➇', full: '➑', circle: '&#x2787;', fulle: '&#x2791;' },
    { x: 9, circ: '➈', full: '➒', circle: '&#x2788;', fulle: '&#x2792;' },
    { x: 10, circ: '➉', full: '➓', circle: '&#x2789;', fulle: '&#x2793;' },
];
