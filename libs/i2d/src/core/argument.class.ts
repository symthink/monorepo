import { BehaviorSubject } from 'rxjs';
import { ARG_LABEL, IText, IArgument } from './interfaces';

export const NewCardID = 'newcard';

export const TagRegEx = {
    cardIdOld: /card:\/\/([a-z0-9]{7})/g,
    cardId: /card:\[([^\]]+)\]/g,
}

export class Card {
    id: string;
    text: IText[] = [];
    label: ARG_LABEL = null;
    links: Card[] = [];
    parent: Card = null;
    active = false;

    constructor(id: string, parent?: Card) {
        // make read-only after first set
        Object.defineProperty(this, 'id', {
            writable: false,
            value: id
        });
        if (parent) {
            this.parent = parent;
        }
    }

    apply(arg: IArgument) {
        if (arg.label) {
            this.label = arg.label;
        }
        if (arg.text && arg.text.length) {
            this.text = [...arg.text];
        }
        if (arg.links && arg.links.length) {
            arg.links.map((a) => this.addChild(a));
        }
    }

    addChild(card?: IArgument) {
        if (!card) {
            const id = Math.random().toString(36).substring(2, 9);
            card = new Card(id, this);
        }
        const child = new Card(card.id, this);
        child.apply(card);
        this.links.push(child);
        return this.links[this.links.length - 1];
    }

    findChild(id: string) {
        return this.links.find((c) => c.id === id);
    }

    setActive() {
        // console.log('setActive', this.id);
        const root = this.getRoot();
        const activeCard = root.getActive();
        if (activeCard) {
            activeCard.active = false;
        }
        this.active = true;
        const path = root.getActivePath();
        root.$activePath.next(path);
    }

    find(callback: Function): Card {
        if (callback(this)) return this;
        for (let card of this.links) {
            const c = card.find(callback.bind(card));
            if (c) return c;
        }
        return undefined;
    }

    getRoot(): BaseCard {
        let card: Card = this;
        while(card.parent) {
            card = card.parent;
        }
        return card as BaseCard;
    }

    getRaw(deep = true): IArgument {
        const o = {
            id: this.id,
            label: this.label,
            text: this.text,
            links: []
        };
        if (deep && this.links && this.links.length) {
            o.links = this.links.map((a) => a.getRaw());
        }
        return o;
    }
    /** Returns the character length of the card */
    textLen() {
        return this.text && this.text.map(o => o.p?.length||0).reduce(
            (prevValue, curValue) => prevValue + curValue, 0) || 0;
    }
    /** WHY ??? */
    count(): number {
        let n = this.textLen() > 50 ? 1 : 0;
        for (let card of this.links) {
            n = n + card.count();
        }
        return n;
    }
    countDecendents(): number {
        let n = this.links?.length || 0;
        for (let card of this.links) {
            n = n + card.countDecendents();
        }
        return n;
    }
    get flatJson(): IArgument {
        return this.getRaw(false);
    }
    removeChild(card: Card): Card {
        const index = this.links.findIndex(c => c.id === card.id);
        if (index !== -1) {
            return this.links.splice(index, 1)[0];
        }
    }
    makeOrphan(): boolean {
        const parent = this.parent;
        const baseCard = this.getRoot();
        const removed = parent.removeChild(this);
        if (removed) {
            baseCard.orphans.push(removed.getRaw());
            return true;
        }
        return false;
    }

    adoptOrphan(id: string) {
        const baseCard = this.getRoot();
        
        const orphanX = baseCard.orphans.findIndex(o => o.id === id);
        if (orphanX !== -1) {
            const orphan = baseCard.orphans.splice(orphanX, orphanX + 1)[0];
            return this.addChild(orphan);
        }
    }
}

// a.k.a root card
export class BaseCard extends Card {
    title: string; // doc title only
    $activePath: BehaviorSubject<Card[]>;
    orphans: IArgument[];

    constructor(key?: string) {
        let id = key;
        if (!id) {
            id = Math.random().toString(36).substring(2, 9);
            console.log('Creating a new BaseCard doc with id:', id);
        }
        super(id);
        this.$activePath = new BehaviorSubject([this]);
        this.active = true;
        this.orphans = [];
    }

    load(arg: BaseCard) {
        this.title = arg.title;
        this.orphans = arg.orphans || [];
        this.apply(arg);
    }

    getRaw(deep = true): IArgument {
        const o = {
            id: this.id,
            label: this.label,
            text: this.text,
            title: this.title,
            orphans: this.orphans,
            links: []
        };
        if (deep && this.links && this.links.length) {
            o.links = this.links.map((a) => a.getRaw());
        }
        return o;
    }

    getActive() {
        return this.find(a => a.active);
    }

    setActiveChild(id: string): boolean {
        const a = this.getActive();
        if (!a || a.id !== id) {
            const child = this.find((c) => c.id === id);
            if (child) {
                child.setActive();
                return true;
            }
        }
        return false;
    }

    getActivePath() {
        let card = this.getActive();
        // console.log('active card', card.active, card);
        const path = [card];
        while (card.parent) {
            card = card.parent;
            path.unshift(card);
        }
        return path;
    }

    toString() {
        const raw = this.getRaw();
        return JSON.stringify(raw);
    }
    
}


