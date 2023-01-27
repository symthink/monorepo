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
    concl?: string;
    lastSupIsConcl?: boolean;
    expires?: number; // for orphans only
    lastmod?: number;
    eventDate?: number; // UTC timestamp for Events only
    selected?: boolean;
    numeric?: boolean; // if true, use numbers instead of bullets for support icons
}
export interface ISymThinkDocument extends ISymThink {
    $chemaver?: number;
    orphans?: ISymThink[];
    format?: FormatEnum;
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
    concl: string; // for Claims only ?
    eventDate: Date; // for Events only
    sup$ = new Subject<boolean>();// true = for adding child, false for removing
    select$ = new Subject<boolean>();
    selected = false;
    numeric = false;

    constructor(id: string, parent?: SymThink) {
        // make read-only after first set
        Object.defineProperty(this, 'id', {
            writable: false,
            value: id
        });
        if (parent) {
            this.parent = parent;
        }
        this.select$.subscribe(v => v ? this.onSelect() : this.selected = false);
    }

    onSelect() {
        console.log('onSelect', this.text)
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
        if (arg.type) {
            this.type = arg.type;
        }
        if (arg.label) {
            this.label = arg.label;
        }
        if (arg.text) {
            this.text = arg.text;
        }
        if (arg.lastSupIsConcl !== undefined) {
            this.lastSupIsConcl = !!arg.lastSupIsConcl;
        }
        if (arg.lastmod) {
            this.lastmod = arg.lastmod;
        }
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
            try { this.url = new URL(arg.url) } catch (e) { }
        }
        if (arg.numeric) {
            this.numeric = arg.numeric;
        }
    }

    genId() { return Math.random().toString(36).substring(2, 9); }

    addChild(card?: ISymThink, doLog = true) {
        if (!this.isKidEnabled()) {
            throw new Error(`This item(${this.id}) is not child enabled`);
        }
        let symthink = new SymThink(this.genId(), this);
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
        // while (card.parent) {
        //     IDs.unshift(card.id);
        //     card = card.parent;
        // }
        IDs.unshift(card.id);
        return IDs;
    }
    getRaw(deep = true): ISymThink {
        const o: ISymThink = {
            id: this.id,
            type: this.type,
            text: this.text,
            concl: this.concl,
            label: this.label,
            eventDate: this.eventDate ? Math.floor(this.eventDate.getTime() / 1000) : undefined,
            support: undefined,
            source: undefined,
        };
        if (this.source) {
            o.source = this.source.map(s => {
                const cp = { ...s } as any;
                try { cp.url = s.url.toString() } catch (e) { }
                try { cp.date = s.date.toString() } catch (e) { }
                return cp;
            });
        }
        if (this.lastSupIsConcl !== undefined) {
            o.lastSupIsConcl = this.lastSupIsConcl;
        }
        if (this.numeric !== undefined) {
            o.numeric = this.numeric;
        }
        if (this.url) {
            o.url = this.url.toString();
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
        const index = this.support.findIndex(c => c === card);
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

    adoptOrphan(id: string) {
        const baseCard = this.getRoot();
        const orphanX = baseCard.orphans.findIndex(o => o.id === id);
        if (orphanX !== -1) {
            this.logAction(StLogActionEnum.ADOPT_ORPHAN);
            const orphan = baseCard.orphans.splice(orphanX, orphanX + 1)[0];
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
}

// a.k.a root card
export class SymThinkDocument extends SymThink {
    $chemaver: number;
    // I think not used
    // $activePath: BehaviorSubject<SymThink[]>;
    orphans: ISymThink[];
    log$: Subject<{ action: number, ts: number }>;
    format: FormatEnum = FormatEnum.Default;
    page$ = new Subject<string[]>();

    get title() {
        return this.label || this.text;
    }

    constructor(key?: string) {
        let id = key;
        if (!id) {
            id = Math.random().toString(36).substring(2, 9);
        }
        super(id);
        this.$chemaver = (key) ? undefined : SCHEMA_VERSION;
        // console.log('constructor(%s) this.$chemaver=%s',key, this.$chemaver);
        this.orphans = [];
    }

    load(arg: ISymThinkDocument) {
        // console.log('load() arg.$chemaver',arg.$chemaver)
        this.$chemaver = arg.$chemaver || SCHEMA_VERSION;
        this.orphans = arg.orphans || [];
        this.format = arg.format;
        if (arg.$chemaver < SCHEMA_VERSION) {
            console.log('Schema migrate from %s to %s', arg.$chemaver, SCHEMA_VERSION);
        }
        this.apply(arg);
    }

    enableLog(logger: any) {
        this.log$ = logger;
    }

    getRaw(deep = true): ISymThinkDocument {
        const o: ISymThinkDocument = {
            id: this.id,
            $chemaver: SCHEMA_VERSION,
            format: this.format || FormatEnum.Default,
            type: this.type,
            text: this.text,
            concl: this.concl,
            label: this.label,
            support: undefined,
            source: undefined,
            orphans: this.orphans,
            lastmod: this.lastmod,
            eventDate: this.eventDate ? Math.floor(this.eventDate.getTime() / 1000) : undefined
        };
        if (this.source) {
            o.source = this.source.map(s => {
                const cp = { ...s } as any;
                try { cp.url = s.url.toString() } catch (e) { }
                try { cp.date = s.date.toString() } catch (e) { }
                return cp;
            });
        }
        if (this.lastSupIsConcl !== undefined) {
            o.lastSupIsConcl = this.lastSupIsConcl;
        }
        if (this.numeric !== undefined) {
            o.numeric = this.numeric;
        }
        if (this.url) {
            o.url = this.url.toString();
        }
        if (deep && this.support) {
            o.support = this.support.map((a) => a.getRaw());
        }
        return o;
    }

    toString() {
        const raw = this.getRaw();
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
        svg: 'assets/icon/questmark.svg',
        placeholder: 'Ask a question',
        supportsPh: 'Guess or suggest an answer, i.e. hypothesis.',
        conclPh: 'Add background context',
        disable: [],
        xtra: false,
        char: '', // e901
        iconCls: 'ico-ques'
    },
    {
        type: ARG_TYPE.Claim,
        name: 'Claim',
        icon: 'megaphone',
        placeholder: 'A Policy, value or factual claim',
        supportsPh: 'Add supporting reasoning or evidence',
        conclPh: 'Conclusion, restate or summarize claim',
        disable: [],
        xtra: false,
        char: '', // e902
        iconCls: 'ico-clm'
    },
    {
        type: ARG_TYPE.Idea,
        name: 'Idea',
        icon: 'bulb',
        placeholder: 'Describe the idea or solution',
        supportsPh: 'Add supporting ideas',
        conclPh: 'Describe the problem it solves',
        disable: [],
        xtra: false,
        char: '', // e900
        iconCls: 'ico-bulb'
    }
];
export const trailingSympunkRegExp = /[]+/g
// export const nonAlphaNumericRegEx = /[^A-Za-zªµºÀ-ÖØ-öø-ˁˆ-ˑˠ-ˤˬˮͰ-ʹͶͷͺ-ͽͿΆΈ-ΊΌΎ-ΡΣ-ϵϷ-ҁҊ-ԯԱ-Ֆՙա-ևא-תװ-ײؠ-يٮٯٱ-ۓەۥۦۮۯۺ-ۼۿܐܒ-ܯݍ-ޥޱߊ-ߪߴߵߺࠀ-ࠕࠚࠤࠨࡀ-ࡘࢠ-ࢴऄ-हऽॐक़-ॡॱ-ঀঅ-ঌএঐও-নপ-রলশ-হঽৎড়ঢ়য়-ৡৰৱਅ-ਊਏਐਓ-ਨਪ-ਰਲਲ਼ਵਸ਼ਸਹਖ਼-ੜਫ਼ੲ-ੴઅ-ઍએ-ઑઓ-નપ-રલળવ-હઽૐૠૡૹଅ-ଌଏଐଓ-ନପ-ରଲଳଵ-ହଽଡ଼ଢ଼ୟ-ୡୱஃஅ-ஊஎ-ஐஒ-கஙசஜஞடணதந-பம-ஹௐఅ-ఌఎ-ఐఒ-నప-హఽౘ-ౚౠౡಅ-ಌಎ-ಐಒ-ನಪ-ಳವ-ಹಽೞೠೡೱೲഅ-ഌഎ-ഐഒ-ഺഽൎൟ-ൡൺ-ൿඅ-ඖක-නඳ-රලව-ෆก-ะาำเ-ๆກຂຄງຈຊຍດ-ທນ-ຟມ-ຣລວສຫອ-ະາຳຽເ-ໄໆໜ-ໟༀཀ-ཇཉ-ཬྈ-ྌက-ဪဿၐ-ၕၚ-ၝၡၥၦၮ-ၰၵ-ႁႎႠ-ჅჇჍა-ჺჼ-ቈቊ-ቍቐ-ቖቘቚ-ቝበ-ኈኊ-ኍነ-ኰኲ-ኵኸ-ኾዀዂ-ዅወ-ዖዘ-ጐጒ-ጕጘ-ፚᎀ-ᎏᎠ-Ᏽᏸ-ᏽᐁ-ᙬᙯ-ᙿᚁ-ᚚᚠ-ᛪᛱ-ᛸᜀ-ᜌᜎ-ᜑᜠ-ᜱᝀ-ᝑᝠ-ᝬᝮ-ᝰក-ឳៗៜᠠ-ᡷᢀ-ᢨᢪᢰ-ᣵᤀ-ᤞᥐ-ᥭᥰ-ᥴᦀ-ᦫᦰ-ᧉᨀ-ᨖᨠ-ᩔᪧᬅ-ᬳᭅ-ᭋᮃ-ᮠᮮᮯᮺ-ᯥᰀ-ᰣᱍ-ᱏᱚ-ᱽᳩ-ᳬᳮ-ᳱᳵᳶᴀ-ᶿḀ-ἕἘ-Ἕἠ-ὅὈ-Ὅὐ-ὗὙὛὝὟ-ώᾀ-ᾴᾶ-ᾼιῂ-ῄῆ-ῌῐ-ΐῖ-Ίῠ-Ῥῲ-ῴῶ-ῼⁱⁿₐ-ₜℂℇℊ-ℓℕℙ-ℝℤΩℨK-ℭℯ-ℹℼ-ℿⅅ-ⅉⅎↃↄⰀ-Ⱞⰰ-ⱞⱠ-ⳤⳫ-ⳮⳲⳳⴀ-ⴥⴧⴭⴰ-ⵧⵯⶀ-ⶖⶠ-ⶦⶨ-ⶮⶰ-ⶶⶸ-ⶾⷀ-ⷆⷈ-ⷎⷐ-ⷖⷘ-ⷞⸯ々〆〱-〵〻〼ぁ-ゖゝ-ゟァ-ヺー-ヿㄅ-ㄭㄱ-ㆎㆠ-ㆺㇰ-ㇿ㐀-䶵一-鿕ꀀ-ꒌꓐ-ꓽꔀ-ꘌꘐ-ꘟꘪꘫꙀ-ꙮꙿ-ꚝꚠ-ꛥꜗ-ꜟꜢ-ꞈꞋ-ꞭꞰ-ꞷꟷ-ꠁꠃ-ꠅꠇ-ꠊꠌ-ꠢꡀ-ꡳꢂ-ꢳꣲ-ꣷꣻꣽꤊ-ꤥꤰ-ꥆꥠ-ꥼꦄ-ꦲꧏꧠ-ꧤꧦ-ꧯꧺ-ꧾꨀ-ꨨꩀ-ꩂꩄ-ꩋꩠ-ꩶꩺꩾ-ꪯꪱꪵꪶꪹ-ꪽꫀꫂꫛ-ꫝꫠ-ꫪꫲ-ꫴꬁ-ꬆꬉ-ꬎꬑ-ꬖꬠ-ꬦꬨ-ꬮꬰ-ꭚꭜ-ꭥꭰ-ꯢ가-힣ힰ-ퟆퟋ-ퟻ豈-舘並-龎ﬀ-ﬆﬓ-ﬗיִײַ-ﬨשׁ-זּטּ-לּמּנּסּףּפּצּ-ﮱﯓ-ﴽﵐ-ﶏﶒ-ﷇﷰ-ﷻﹰ-ﹴﹶ-ﻼＡ-Ｚａ-ｚｦ-ﾾￂ-ￇￊ-ￏￒ-ￗￚ-ￜ0-9 ]+$/

