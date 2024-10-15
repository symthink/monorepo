import { ActionSheetButton, ActionSheetOptions, alertController, modalController, OverlayEventDetail, popoverController } from '@ionic/core';
import { HostElement } from '@stencil/core/internal';
import { ARG_TYPE, CardRules, FormatEnum, isCSL, MAX_KIDS, SymThink, SymThinkDocument, trailingSympunkRegExp } from '@symthink/i2d';
import { Subject } from 'rxjs';
import { ENV } from '../environment/config';

export enum IncomingMsgActionEnum {
    READDOC = 1,
    EDITDOC = 2,
    DIDSAVE = 3,
    VIEWTREE = 4,
    SOURCE = 5,
    POSTBACK = 6,
    POSTSUBCR = 7,
    RECYCLE = 8,
    THEREFORE = 9,
    LISTTYPE = 10,
    REORDER = 11,
    EDITEDITEM = 12,
}

export enum OutgoingMsgActionEnum {
    PAGECHANGE = 100,
    MODIFIED = 101,
    ERROR = 102,
    ADDSOURCE = 103,
    VIEWTREE = 104,
    POST = 105,
    OPEN = 106,
    READY = 107,
    REPLACE = 108,
    EXPORT = 109,
    SCROLL = 110,
    PRIVACY = 111,
    EDITITEM = 112,
    METRIC = 113,
    RECYCLE = 114,
}

export interface IPostMessage {
    action: IncomingMsgActionEnum,
    value: any
}

class AppService {
    maxwidthMediaQuery: MediaQueryList;
    editing = false;
    saved = true;
    // selectedItem: SymThink;
    currentSymthink: SymThink;
    symthinkDoc: SymThinkDocument;
    mod$: Subject<void>;
    sourceWin: MessageEventSource;
    recycle$: Subject<{ source; id }>;
    themeChange$: Subject<void> = new Subject();
    prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    async init() {
        console.info(`Symthink app v${ENV.version} built ${(new Date(ENV.timestamp).toLocaleString())}`);
        this.sourceWin = window.parent;
        this.maxwidthMediaQuery = window.matchMedia("only screen and (max-width: 768px)");
        this.mod$ = new Subject();
        this.recycle$ = new Subject<{ source; id }>();
        this.mod$.subscribe(() => this.onDocModified());
        this.recycle$.subscribe((arg) => this.onNextRecycleReceived(arg));

        // use light only for MVP
        // this.setTheme();
    }

    onDocModified() {
        this.saved = false;
        const raw = this.symthinkDoc.getRawDoc();
        this.sendMessage(OutgoingMsgActionEnum.MODIFIED, raw);
    }

    onPostMessageReceived(event: MessageEvent, didLoad: Function) {
        console.log('[stdoc] received postMessage: ', event.data);
        try {
            console.log('[stdoc] sourceWin set to:', this.sourceWin);
            const data: IPostMessage = event.data;

            if (data.action === IncomingMsgActionEnum.POSTBACK) {
                const stdoc = new SymThinkDocument();
                stdoc.load(data.value);
                const child = stdoc.getSubscriber(this.symthinkDoc);
                if (child) {
                    child.subscribe(stdoc);
                    this.mod$.next();// to save
                } else {
                    console.warn('child subscriber not found');
                }
                // ? rejection with msg: 'Need to login'? 

                // refresh view.. should now be showing item with link icon?
                // tapping item should open a model with that symthink but with permission 
                // restricted view?
                return;
            }

            if (
                [IncomingMsgActionEnum.EDITDOC, IncomingMsgActionEnum.READDOC].includes(
                    data.action
                )
            ) {
                if (!event.data.value?.id) {
                    throw new Error('Invalid object');
                }
                this.symthinkDoc = new SymThinkDocument(event.data.value.id);
                this.symthinkDoc.load(event.data.value);
                this.symthinkDoc.enableLog();
                AppSvc.editing = IncomingMsgActionEnum.EDITDOC === data.action;
                didLoad();
            } else {
                if (!this.symthinkDoc) {
                    let msg = 'Must open a Symthink document first.';
                    throw new Error(msg);
                }
                if (data.action === IncomingMsgActionEnum.SOURCE) {
                    const itemId = data.value?.itemId;
                    const srcData = data.value?.source;
                    if (!isCSL(srcData)) {
                        throw new Error('Invalid CSL source');
                    }
                    const card = this.symthinkDoc.find((c) => c.id === itemId);
                    if (card) {
                        card.addSource(srcData);
                    } else {
                        console.warn('card not found; will use current card');
                        this.currentSymthink.addSource(srcData);
                    }
                    this.mod$.next();
                }
                else if (data.action === IncomingMsgActionEnum.RECYCLE) {
                    this.onRecycleItemClick();
                }
                else if (data.action === IncomingMsgActionEnum.THEREFORE) {
                    this.onUseConclusion();
                }
                else if (data.action === IncomingMsgActionEnum.LISTTYPE) {
                    this.toggleBulletType();
                }
                else if (data.action === IncomingMsgActionEnum.REORDER) {
                    this.toggleReorder();
                }
                else if (data.action === IncomingMsgActionEnum.EDITEDITEM) {
                    const item = this.symthinkDoc.find((c) => c.id === data.value?.id);
                    if (item) {
                        if (data.value.text) item.text = data.value.text;
                        if (data.value.type) item.type = data.value.type;
                        if (data.value.label) item.label = data.value.label;
                        if (data.value.private) {
                            item.private = true;
                        } 
                        this.mod$.next();
                    }
                }
            }
        } catch (e) {
            const msg = e.message + ` Expecting: {action: IncomingMsgActionEnum, value: any}

            IncomingMsgActionEnum {
                READDOC = 1,
                EDITDOC = 2,
                DIDSAVE = 3,
                VIEWTREE = 4,
                SOURCE = 5,
                POSTBACK = 6,
                POSTSUBCR = 7,
                RECYCLE = 8,
                THEREFORE = 9,
                LISTTYPE = 10,
                REORDER = 11,
                EDITEDITEM = 12,
            }`;
            AppSvc.sendMessage(OutgoingMsgActionEnum.ERROR, msg);
        }
        // ...
    }

    sendMessage(action: OutgoingMsgActionEnum, value: any = null) {
        this.sourceWin.postMessage(
            { action, value }, { targetOrigin: '*' }
        );
    }

    onNextRecycleReceived(arg: { source: string; id: string }): void {
        if (arg.source === 'recycle') {
            const newKid = this.currentSymthink.adoptOrphan(arg.id);
            if (newKid) {
                this.mod$.next();
            }
        }
    }

    async presentRecycleSelectModal() {
        // const symthinkDoc = AppSvc.collection.loaded$.getValue();
        const modal = await modalController.create({
            component: 'app-select-recycled',
            initialBreakpoint: 0.5,
            breakpoints: [0, 0.5, 1],
            componentProps: {
                recycleBin: this.symthinkDoc.getOrphans(),
                recycle$: this.recycle$,
            },
        });
        modal.present();
        return modal.onDidDismiss();

    }

    async onRecycleItemClick() {
        if (this.currentSymthink.maxKids()) {
            this.notifyMaxItemsReached();
        } else {
            const top = await modalController.getTop();
            if (top) {
                await top.dismiss();
            } else {
                await this.presentRecycleSelectModal();
            }
        }
    }

    async onUseConclusion() {
        if (this.currentSymthink.lastSupIsConcl) {
            this.currentSymthink.lastSupIsConcl = false;
        } else {
            this.currentSymthink.lastSupIsConcl = true;
        }
        this.mod$.next();
    }


    toggleBulletType() {
        this.symthinkDoc.deselect();
        this.currentSymthink.numeric = !this.currentSymthink.numeric;
        this.mod$.next();
    }

    toggleReorder(): void {
        this.symthinkDoc.deselect();
        this.currentSymthink.reorder$.next(!this.currentSymthink.reorder$.value);
    }

    async dismissAlerts() {
        const alrt = await alertController.getTop();
        if (alrt) {
            await alrt.dismiss();
        }
    }

    async presentConfirm(message: string, title?: string, isDestructive = false): Promise<boolean> {
        await this.dismissAlerts();
        return new Promise(async (resolve) => {
            const alert = await alertController.create({
                header: title || 'Please confirm',
                message,
                cssClass: 'symthink-alert',
                buttons: [
                    {
                        text: 'Cancel',
                        role: 'cancel',
                        handler: () => {
                            resolve(false)
                        }
                    }, {
                        text: isDestructive ? 'Delete' : 'Continue',
                        role: isDestructive ? 'delete' : undefined,
                        handler: () => {
                            resolve(true)
                        }
                    }
                ]
            });
            await alert.present();
        })
    }


    async onItemOptionsSelect(item: SymThink, evt?: MouseEvent | PointerEvent) {
        const buttons: ActionSheetButton[] = [];
        if (item.url) {
            buttons.push({
                text: 'Unsubscribe',
                role: 'unsubscribe',
                icon: 'notifications-off-outline'
            });
        } else {
            buttons.push({
                text: 'Extend',
                role: 'extend',
                icon: 'arrow-forward-outline'
            });
            buttons.push({
                text: 'Trim',
                role: 'trim',
                icon: 'cut-outline'
            });
        }
        const opts = {
            buttons
        }
        const rs = await this.presentDynamicSelect(opts, evt, false);
        return this.handleItemOption(item, rs, evt);
    }

    async presentDynamicSelect(opts: ActionSheetOptions, evt?: any, shadowRoot = true): Promise<OverlayEventDetail<any>> {
        let over: HTMLIonPopoverElement;
        over = await popoverController.create({
            component: 'd2-select',
            cssClass: 'item-opts-popover',
            reference: 'event',
            componentProps: {
                options: opts
            }
        });
        over.present(evt);
        if (shadowRoot && evt) {
            const hostEl = over.shadowRoot.host as HostElement;
            const offsetX = evt.x / 2 - 100;
            let offsetY = ((screen.availHeight / 2) - evt.y) - 100;
            offsetY = (offsetY > 0) ? -Math.abs(offsetY) : Math.abs(offsetY);
            hostEl.style.setProperty('--offset-x', offsetX + 'px');
            hostEl.style.setProperty('--offset-y', offsetY + 'px');
        }
        return over.onDidDismiss();
    }

    async handleItemOption(item: SymThink, rs: OverlayEventDetail, evt?: MouseEvent | PointerEvent) {
        let modified = false;
        console.log('handle', rs.role, item)
        switch (rs.role) {
            case 'extend':
                if (item.type === ARG_TYPE.Question) {
                    item.decision = {
                        ts: (new Date()).toISOString(),
                        scope: null
                    }
                }
                item.enableKids();
                modified = true;
                break;
            case 'disablekids':
                item.disableKids();
                break;
            case 'recycle':
                if (item.hasKids()) {
                    const alert = await alertController.create({
                        cssClass: 'symthink-alert',
                        header: 'Confirm Recycle',
                        message: `This item has ${item.support?.length} supporting item(s). To keep this item, remove the supports first. Or, "Continue" to put the whole branch in the recycle bin.`,
                        buttons: ['Cancel', { text: 'Continue', role: 'archive' }],
                    });
                    await alert.present();
                    const { role } = await alert.onDidDismiss();
                    if (role === 'archive') {
                        item.makeOrphan();
                    }    
                } else {
                    item.makeOrphan();
                }
                // move this functionality to the parent window
                // then remove orphan funcs from here
                this.sendMessage(OutgoingMsgActionEnum.RECYCLE, item.getRaw(true));
                modified = true;
                break;
            // deprecated; done with punctuation now onBlur
            case 'change-type':
                const type = await this.presentSymthinkTypeChooser(evt);
                if (type !== 'backdrop') {
                    item.type = type as ARG_TYPE;
                    if (item.text) {
                        const typ = CardRules.find((r) => r.type === item.type);
                        item.text = item.text.replace(trailingSympunkRegExp, '')
                            .replace(/[\.\!\?]+$/, '') + typ.char;
                        modified = true;
                    }
                }
                break;
            // deprecated
            case 'quick-share':
                this.shareSymthinkShallow(item);
                break;
            case 'add-support':
                item.addChild({ type: ARG_TYPE.Statement });
                break;
            case 'title-edit':
                const { data, role } = await AppSvc.presentLabelInput(
                    item.label || ''
                );
                if (role !== 'cancel') {
                    item.label = data.values.label;
                    modified = true;
                }
                break;
            case 'format-default':
                const doc = item as SymThinkDocument;
                doc.format = FormatEnum.Default;
                break;
            case 'format-review':
                const doc2 = item as SymThinkDocument;
                doc2.format = FormatEnum.Review;
                break;
            case 'decision':
                const yes = await this.presentConfirm('Replace this question with the top idea in the list.  The other items will be archived.',
                    'Confirm Decision');
                if (yes) {
                    item.decide();
                    modified = true;
                }
                break;
            case 'post':
                // send question text out to parent window
                this.sendMessage(OutgoingMsgActionEnum.POST, item.getRaw(true));
                // parent win: handle modal pop up with scope question and decision configuration
                break;
            case 'search':
                const encoded = encodeURIComponent(item.text);
                window.top.open(`https://www.google.com/search?q=${encoded}`, '_blank');
                break;
            case 'unsubscribe':
                // delete subscription
                delete item.url;
                delete item.decision;
                delete item.creator;
                delete item.creatorId;
                modified = true;
                break;
            case 'add-source':
                this.sendMessage(OutgoingMsgActionEnum.ADDSOURCE, item.id);
                break;
            case 'replace':
                this.sendMessage(OutgoingMsgActionEnum.REPLACE, item.id);
                break;
            case 'export':
                this.sendMessage(OutgoingMsgActionEnum.EXPORT, item.getRaw(true));
                break;
            case 'toggle-private':
                if (item.private) {
                    delete item.private;
                } else {
                    item.private = true;
                }
                this.sendMessage(OutgoingMsgActionEnum.PRIVACY, !!item.private);
                modified = true;
                break;
            case 'edit':
                this.sendMessage(OutgoingMsgActionEnum.EDITITEM, item.getRaw(false));
                break;
    
            default:
                console.warn('Item option response not found:', rs);
        }
        return modified;
    }

    async presentSymthinkTypeChooser(evt?: any, subopt = false): Promise<string> {
        let copy = [...CardRules];
        // copy.reverse();
        const buttons: ActionSheetButton[] = copy.map((rule) => {
            return {
                text: rule.name,
                icon: rule.icon || rule.svg,
                id: 'type-' + rule.type.toLowerCase(),
                role: rule.type
            }
        });
        const opts = {
            buttons
        };
        return this.presentDynamicSelect(opts, evt, subopt).then(rs => {
            return rs.role;
        });
    }

    async shareSymthinkShallow(symthink: SymThink) {
        const url = '/assets/thk.html?s=' + encodeURIComponent(JSON.stringify(symthink.shallowCopy()));
        const shareData: ShareData = {
            text: symthink.text,
            url: location.protocol + '//' + location.host + url
        }
        try {// navigator.canShare does not exist on desktop browsers
            if (navigator.canShare && navigator.canShare(shareData)) {
                navigator.share(shareData);
            } else {
                navigator.clipboard.writeText(symthink.textPage());
                this.presentNotice('The Quick Share URL has been copied to your clipboard.', 'Copied!');
            }
        }
        catch (e) {
            console.log(e);
        }
    }

    async presentNotice(message: string, title?: string) {
        await this.dismissAlerts();
        const alert = await alertController.create({
            header: title || 'Notice',
            cssClass: 'symthink-alert',
            message,
            buttons: ['OK']
        });
        return alert.present();
    }

    async presentLabelInput(value: string = '') {
        await this.dismissAlerts();
        const alert = await alertController.create({
            header: 'Enter a Title',
            cssClass: 'input-alert',
            inputs: [
                {
                    type: 'text',
                    name: 'label',
                    value,
                    attributes: {
                        minlength: 5,
                        maxlength: 40,
                        autofocus: true
                    },
                    placeholder: 'Enter 5-40 characters',
                }
            ],
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                },
                {
                    text: 'Save'
                },
            ]
        });
        alert.present();
        return alert.onDidDismiss();
    }

    async onDocHeaderOptsSelect(item: SymThinkDocument, evt?: MouseEvent | PointerEvent) {
        const buttons: ActionSheetButton[] = [
            // {
            //     text: 'Title ...',
            //     role: 'title-edit'
            // },
            {
                text: 'By me',
                data: FormatEnum.Default
            },
            {
                text: 'Review by me',
                data: FormatEnum.Review
            }
        ];
        const opts = {
            header: 'Header Format',
            buttons
        }
        const { role, data } = await this.presentDynamicSelect(opts, evt, false);
        if (role !== 'backdrop' && item.format !== data) {
            item.format = data;
            AppSvc.mod$.next();
        }
    }

    async presentAddSourceModal(text?: string) {
        const modal = await modalController.create({
            component: 'app-add-source-modal',
            componentProps: { text }
        });
        modal.present();
        return modal.onDidDismiss();
    }

    async notifyMaxItemsReached() {
        AppSvc.presentNotice('Cannot add more than '+MAX_KIDS+' supporting items. Try consolidating into fewer items.  Then expand on those with child items.');
    }

    async presentShareLinkInput(): Promise<string> {
        await AppSvc.dismissAlerts();
        return new Promise(async (resolve) => {
            const alert = await alertController.create({
                header: 'Public Symthink URL',
                cssClass: 'input-alert',
                inputs: [
                    {
                        type: 'url',
                        name: 'shareurl',
                        value: '',
                        attributes: {
                            autofocus: true
                        },
                        placeholder: 'Enter a public symthink URL',
                    }
                ],
                buttons: [
                    {
                        text: 'Cancel',
                        role: 'cancel',
                    },
                    {
                        text: 'Save',
                        handler: (input) => resolve(input.shareurl),
                    },
                ]
            });
            await alert.present();
        });
    }
    get isWidescreen(): boolean {
        return window.innerWidth >= 600;
    }

    get isMobilePhone(): boolean {
        return this.maxwidthMediaQuery.matches && this.isMobileUserAgent;
    }

    get isMobileUserAgent(): boolean {
        const userAgent = navigator.userAgent || navigator.vendor;
        return /windows phone/i.test(userAgent) || /android/i.test(userAgent) || /iPhone|iPod/.test(userAgent);
    }

    // private onPrefersDarkChange(e) {
    //     document.body.classList.toggle('dark', e.matches);
    //     this.themeChange$.next();
    // }

    // private setTheme() {
    //     // Add or remove the "dark" class based on if the media query matches
    //     const toggleDarkTheme = (shouldAdd) => {
    //         document.body.classList.toggle('dark', shouldAdd);
    //     }
    //     toggleDarkTheme(this.prefersDark.matches);
    //     // Listen for changes to the prefers-color-scheme media query
    //     this.prefersDark.addEventListener('change', this.onPrefersDarkChange.bind(this));
    // }
}

export const AppSvc = new AppService();

