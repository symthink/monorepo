/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { ISymThink, SymThink } from "@symthink/i2d";
import { Subject } from "rxjs";
import { MatchResults } from "@stencil/router";
import { CitationStyleLang, SymThink as SymThink1, SymThinkDocument } from "../../../libs/i2d/src/core/symthink.class";
import { ActionSheetOptions } from "@ionic/core/dist/types/components/action-sheet/action-sheet-interface";
export namespace Components {
    interface AppDoc {
        "comingBack": () => Promise<void>;
        "domrect": DOMRect;
        "level": number;
        "mod$": Subject<void>;
        "nav$": Subject<number>;
        "symthink": SymThink;
    }
    interface AppHome {
    }
    interface AppProfile {
        "match": MatchResults;
    }
    interface AppRoot {
    }
    interface AppSelectRecycled {
        "recycle$": Subject<{source, id}>;
        "recycleBin": ISymThink[];
    }
    interface D2HeadFormat {
        "canEdit": boolean;
        "created": number | string;
        "displayName": string;
        "modified": number | string;
        "refresh"?: Subject<any | void>;
        /**
          * Symthink Document
         */
        "symthinkDoc": SymThinkDocument;
    }
    interface D2Metric {
        "name": string;
        "value": string | number;
    }
    interface D2Metrics {
        "modalClassName"?: string;
        "refresh"?: Subject<any | void>;
        /**
          * Symthink Document
         */
        "symthinkDoc": SymThinkDocument;
    }
    interface D2Outline {
        "active": string;
        "doc": SymThinkDocument;
        "inModal": boolean;
    }
    interface D2Rcard {
        "canEdit": boolean;
        /**
          * Cannot pass this via html attribute. Data must be an object reference, so pass via JSX or Javascript.
         */
        "data": SymThinkDocument | SymThink1;
        "domrect"?: DOMRect;
        "notify"?: Subject<string>;
    }
    interface D2Select {
        "options": ActionSheetOptions;
    }
    interface D2SrcMetadata {
        "canEdit": boolean;
        "data": CitationStyleLang;
        "index": number;
        "listNo": number;
        "stid": string;
    }
    interface D2SymthinkDoc {
        "data": SymThink1;
    }
}
export interface AppDocCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLAppDocElement;
}
export interface D2HeadFormatCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLD2HeadFormatElement;
}
export interface D2MetricCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLD2MetricElement;
}
export interface D2OutlineCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLD2OutlineElement;
}
export interface D2RcardCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLD2RcardElement;
}
export interface D2SrcMetadataCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLD2SrcMetadataElement;
}
export interface D2SymthinkDocCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLD2SymthinkDocElement;
}
declare global {
    interface HTMLAppDocElement extends Components.AppDoc, HTMLStencilElement {
    }
    var HTMLAppDocElement: {
        prototype: HTMLAppDocElement;
        new (): HTMLAppDocElement;
    };
    interface HTMLAppHomeElement extends Components.AppHome, HTMLStencilElement {
    }
    var HTMLAppHomeElement: {
        prototype: HTMLAppHomeElement;
        new (): HTMLAppHomeElement;
    };
    interface HTMLAppProfileElement extends Components.AppProfile, HTMLStencilElement {
    }
    var HTMLAppProfileElement: {
        prototype: HTMLAppProfileElement;
        new (): HTMLAppProfileElement;
    };
    interface HTMLAppRootElement extends Components.AppRoot, HTMLStencilElement {
    }
    var HTMLAppRootElement: {
        prototype: HTMLAppRootElement;
        new (): HTMLAppRootElement;
    };
    interface HTMLAppSelectRecycledElement extends Components.AppSelectRecycled, HTMLStencilElement {
    }
    var HTMLAppSelectRecycledElement: {
        prototype: HTMLAppSelectRecycledElement;
        new (): HTMLAppSelectRecycledElement;
    };
    interface HTMLD2HeadFormatElement extends Components.D2HeadFormat, HTMLStencilElement {
    }
    var HTMLD2HeadFormatElement: {
        prototype: HTMLD2HeadFormatElement;
        new (): HTMLD2HeadFormatElement;
    };
    interface HTMLD2MetricElement extends Components.D2Metric, HTMLStencilElement {
    }
    var HTMLD2MetricElement: {
        prototype: HTMLD2MetricElement;
        new (): HTMLD2MetricElement;
    };
    interface HTMLD2MetricsElement extends Components.D2Metrics, HTMLStencilElement {
    }
    var HTMLD2MetricsElement: {
        prototype: HTMLD2MetricsElement;
        new (): HTMLD2MetricsElement;
    };
    interface HTMLD2OutlineElement extends Components.D2Outline, HTMLStencilElement {
    }
    var HTMLD2OutlineElement: {
        prototype: HTMLD2OutlineElement;
        new (): HTMLD2OutlineElement;
    };
    interface HTMLD2RcardElement extends Components.D2Rcard, HTMLStencilElement {
    }
    var HTMLD2RcardElement: {
        prototype: HTMLD2RcardElement;
        new (): HTMLD2RcardElement;
    };
    interface HTMLD2SelectElement extends Components.D2Select, HTMLStencilElement {
    }
    var HTMLD2SelectElement: {
        prototype: HTMLD2SelectElement;
        new (): HTMLD2SelectElement;
    };
    interface HTMLD2SrcMetadataElement extends Components.D2SrcMetadata, HTMLStencilElement {
    }
    var HTMLD2SrcMetadataElement: {
        prototype: HTMLD2SrcMetadataElement;
        new (): HTMLD2SrcMetadataElement;
    };
    interface HTMLD2SymthinkDocElement extends Components.D2SymthinkDoc, HTMLStencilElement {
    }
    var HTMLD2SymthinkDocElement: {
        prototype: HTMLD2SymthinkDocElement;
        new (): HTMLD2SymthinkDocElement;
    };
    interface HTMLElementTagNameMap {
        "app-doc": HTMLAppDocElement;
        "app-home": HTMLAppHomeElement;
        "app-profile": HTMLAppProfileElement;
        "app-root": HTMLAppRootElement;
        "app-select-recycled": HTMLAppSelectRecycledElement;
        "d2-head-format": HTMLD2HeadFormatElement;
        "d2-metric": HTMLD2MetricElement;
        "d2-metrics": HTMLD2MetricsElement;
        "d2-outline": HTMLD2OutlineElement;
        "d2-rcard": HTMLD2RcardElement;
        "d2-select": HTMLD2SelectElement;
        "d2-src-metadata": HTMLD2SrcMetadataElement;
        "d2-symthink-doc": HTMLD2SymthinkDocElement;
    }
}
declare namespace LocalJSX {
    interface AppDoc {
        "domrect"?: DOMRect;
        "level"?: number;
        "mod$"?: Subject<void>;
        "nav$"?: Subject<number>;
        "onDocAction"?: (event: AppDocCustomEvent<{ action; value }>) => void;
        "symthink"?: SymThink;
    }
    interface AppHome {
    }
    interface AppProfile {
        "match"?: MatchResults;
    }
    interface AppRoot {
    }
    interface AppSelectRecycled {
        "recycle$"?: Subject<{source, id}>;
        "recycleBin"?: ISymThink[];
    }
    interface D2HeadFormat {
        "canEdit"?: boolean;
        "created"?: number | string;
        "displayName"?: string;
        "modified"?: number | string;
        "onDocAction"?: (event: D2HeadFormatCustomEvent<{
    action;
    value;
    pointerEvent?: MouseEvent | PointerEvent;
  }>) => void;
        "refresh"?: Subject<any | void>;
        /**
          * Symthink Document
         */
        "symthinkDoc"?: SymThinkDocument;
    }
    interface D2Metric {
        "name"?: string;
        "onMetricClick"?: (event: D2MetricCustomEvent<string>) => void;
        "value"?: string | number;
    }
    interface D2Metrics {
        "modalClassName"?: string;
        "refresh"?: Subject<any | void>;
        /**
          * Symthink Document
         */
        "symthinkDoc"?: SymThinkDocument;
    }
    interface D2Outline {
        "active"?: string;
        "doc"?: SymThinkDocument;
        "inModal"?: boolean;
        "onDocClose"?: (event: D2OutlineCustomEvent<void>) => void;
    }
    interface D2Rcard {
        "canEdit"?: boolean;
        /**
          * Cannot pass this via html attribute. Data must be an object reference, so pass via JSX or Javascript.
         */
        "data"?: SymThinkDocument | SymThink1;
        "domrect"?: DOMRect;
        "notify"?: Subject<string>;
        "onDocAction"?: (event: D2RcardCustomEvent<{ action; value }>) => void;
        "onItemAction"?: (event: D2RcardCustomEvent<{
    action;
    value;
    domrect?: DOMRect;
    pointerEvent?: MouseEvent | PointerEvent;
  }>) => void;
    }
    interface D2Select {
        "options"?: ActionSheetOptions;
    }
    interface D2SrcMetadata {
        "canEdit"?: boolean;
        "data"?: CitationStyleLang;
        "index"?: number;
        "listNo"?: number;
        "onItemAction"?: (event: D2SrcMetadataCustomEvent<{ action; value }>) => void;
        "stid"?: string;
    }
    interface D2SymthinkDoc {
        "data"?: SymThink1;
        "onDocAction"?: (event: D2SymthinkDocCustomEvent<{ action; value }>) => void;
    }
    interface IntrinsicElements {
        "app-doc": AppDoc;
        "app-home": AppHome;
        "app-profile": AppProfile;
        "app-root": AppRoot;
        "app-select-recycled": AppSelectRecycled;
        "d2-head-format": D2HeadFormat;
        "d2-metric": D2Metric;
        "d2-metrics": D2Metrics;
        "d2-outline": D2Outline;
        "d2-rcard": D2Rcard;
        "d2-select": D2Select;
        "d2-src-metadata": D2SrcMetadata;
        "d2-symthink-doc": D2SymthinkDoc;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "app-doc": LocalJSX.AppDoc & JSXBase.HTMLAttributes<HTMLAppDocElement>;
            "app-home": LocalJSX.AppHome & JSXBase.HTMLAttributes<HTMLAppHomeElement>;
            "app-profile": LocalJSX.AppProfile & JSXBase.HTMLAttributes<HTMLAppProfileElement>;
            "app-root": LocalJSX.AppRoot & JSXBase.HTMLAttributes<HTMLAppRootElement>;
            "app-select-recycled": LocalJSX.AppSelectRecycled & JSXBase.HTMLAttributes<HTMLAppSelectRecycledElement>;
            "d2-head-format": LocalJSX.D2HeadFormat & JSXBase.HTMLAttributes<HTMLD2HeadFormatElement>;
            "d2-metric": LocalJSX.D2Metric & JSXBase.HTMLAttributes<HTMLD2MetricElement>;
            "d2-metrics": LocalJSX.D2Metrics & JSXBase.HTMLAttributes<HTMLD2MetricsElement>;
            "d2-outline": LocalJSX.D2Outline & JSXBase.HTMLAttributes<HTMLD2OutlineElement>;
            "d2-rcard": LocalJSX.D2Rcard & JSXBase.HTMLAttributes<HTMLD2RcardElement>;
            "d2-select": LocalJSX.D2Select & JSXBase.HTMLAttributes<HTMLD2SelectElement>;
            "d2-src-metadata": LocalJSX.D2SrcMetadata & JSXBase.HTMLAttributes<HTMLD2SrcMetadataElement>;
            "d2-symthink-doc": LocalJSX.D2SymthinkDoc & JSXBase.HTMLAttributes<HTMLD2SymthinkDocElement>;
        }
    }
}
