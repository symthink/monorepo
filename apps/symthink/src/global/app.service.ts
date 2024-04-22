import { ActionSheetButton, ActionSheetOptions, alertController, modalController, OverlayEventDetail, popoverController } from '@ionic/core';
import { HostElement } from '@stencil/core/internal';
import { ARG_TYPE, CardRules, FormatEnum, SymThink, SymThinkDocument, trailingSympunkRegExp } from '@symthink/i2d';
import { Subject } from 'rxjs';
import { ENV } from '../environment/config';

export enum IncomingMsgActionEnum {
    READDOC = 1,
    EDITDOC = 2,
    DIDSAVE = 3,
    VIEWTREE = 4,
    SOURCE = 5,
    POSTBACK = 6,
}

export enum OutgoingMsgActionEnum {
    PAGECHANGE = 100,
    MODIFIED = 101,
    ERROR = 102,
    ADDSOURCE = 103,
    VIEWTREE = 104,
    POST = 105,
    OPEN = 106,
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

    async init() {
        console.info(`Symthink app v${ENV.version} built ${(new Date(ENV.timestamp).toLocaleString())}`);
        this.maxwidthMediaQuery = window.matchMedia("only screen and (max-width: 768px)");
        this.mod$ = new Subject();
        this.mod$.subscribe(() => this.onDocModified());
        const url = new URL(document.location.href);
        if (url.searchParams.has('dark')) {
            document.body.classList.add('dark');
        }
    }

    onDocModified() {
        this.saved = false;
        const raw = this.symthinkDoc.getRawDoc();
        this.sendMessage(OutgoingMsgActionEnum.MODIFIED, structuredClone(raw));
    }

    onPostMessageReceived(event: MessageEvent, didLoad: Function) {
        console.log('Symthink received postMessage: ', event.data)
        if (event.origin !== location.protocol + '//' + location.host) {
            return new Error(
                'This micro-frontend does not support cross-origin messaging.'
            );
        }
        const data: IPostMessage = event.data;
        try {
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
                if (!event.data.value.id) {
                    throw new Error('Invalid object');
                }
                this.symthinkDoc = new SymThinkDocument(event.data.value.id);
                this.symthinkDoc.load(event.data.value);
                this.symthinkDoc.enableLog();
                AppSvc.editing = IncomingMsgActionEnum.EDITDOC === data.action;
                didLoad();
            } else {
                if (!this.symthinkDoc) {
                    throw new Error('Must open a Symthink document first.');
                }
                if (data.action === IncomingMsgActionEnum.SOURCE) {
                    const itemId = data.value?.itemId;
                    const srcData = data.value?.source;
                    const card = this.symthinkDoc.find((c) => c.id === itemId);
                    if (card) {
                        card.addSource(srcData);
                    } else {
                        console.warn('card not found; will use current card');
                        this.currentSymthink.addSource(srcData);
                    }
                    this.mod$.next();
                }
            }
        } catch (e) {
            console.warn('Error', e)
            AppSvc.sendMessage(OutgoingMsgActionEnum.ERROR, e.message);
        }
        // ...
    }

    sendMessage(action: OutgoingMsgActionEnum, value: any = null) {
        window.parent.postMessage(
            { action, value },
            location.protocol + '//' + location.host
        );
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


    async onItemOptionsSelect(item: SymThink, isPageTopItem: boolean, evt?: MouseEvent | PointerEvent) {
        const buttons: ActionSheetButton[] = [];


        if (item.url) {
            buttons.push({
                text: 'Unsubscribe',
                role: 'unsubscribe',
                icon: 'notifications-off-outline'
            });    
        } else {
            if (isPageTopItem) {
                if (item.type === ARG_TYPE.Question) {
                    buttons.push({
                      text: 'Decision',
                      role: 'decision',
                      icon: 'git-merge-outline'
                    });
                }
            } else { // support
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
                const postText = item.type === ARG_TYPE.Question ?
                        'Post': 'Rephrase & Post';
                buttons.push({
                    text: postText,
                    role: 'post',
                    icon: 'chatbubbles-outline'
                });
                buttons.push({
                    text: 'Google Search',
                    role: 'search',
                    icon: 'search-outline'
                });
            }
            buttons.push({
                text: 'Add Source',
                role: 'add-source',
                icon: 'add-outline'
              });
            buttons.push({
                text: 'Change type ...',
                role: 'change-type',
            });
        }
        if (isPageTopItem) {
            // buttons.push({
            //     text: 'Quick share ...',
            //     role: 'quick-share',
            // });
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
            case 'trim':
                if (item.canDisable()) {
                    item.disableKids();
                } else {
                    if (item.hasKids()) {
                        const alert = await alertController.create({
                            cssClass: 'symthink-alert',
                            header: 'Confirm Remove',
                            message: `Click Continue to move this item and it's child items into this document's Recycling Bin.  It will be automatically deleted after 7 days.`,
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
                }
                modified = true;
                break;
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
            case 'quick-share':
                this.shareSymthinkShallow(item);
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
                this.sendMessage(OutgoingMsgActionEnum.POST, structuredClone(item.getRaw(true)));
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
            default:
                console.warn('Item option response not found:', rs);
        }
        return modified;
    }

    async presentSymthinkTypeChooser(evt?: any, subopt = false): Promise<string> {
        let copy = [...CardRules];
        copy.reverse();
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
        const {role, data} = await this.presentDynamicSelect(opts, evt, false);
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
        AppSvc.presentNotice('Cannot add more than 9 supporting items. Try consolidating your big ideas into fewer items.  Then expand on those with child items.');
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
}

export const AppSvc = new AppService();

