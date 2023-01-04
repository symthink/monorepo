/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { SymThink } from "@symthink/i2d";
import { ISource, SymThink as SymThink1, SymThinkDocument } from "../../../libs/i2d/src/core/symthink.class";
import { Subject } from "rxjs";
export namespace Components {
    interface AppDoc {
        "data": SymThink;
        "level": number;
    }
    interface AppRoot {
    }
    interface D2Icon {
        "expandable": boolean;
        "label": any;
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
    interface D2Rcard {
        "canEdit": boolean;
        "closeBtn": boolean;
        /**
          * Cannot pass this via html attribute. Data must be an object reference, so pass via JSX or Javascript.
         */
        "data": SymThinkDocument | SymThink1;
        "domrect"?: DOMRect;
        "notify"?: Subject<string>;
        "reOrderDisabled": boolean;
    }
    interface D2SrcMetadata {
        "canEdit": boolean;
        "data": ISource;
        "index": number;
    }
    interface D2SymthinkDoc {
        "data": SymThink1;
    }
}
export interface AppDocCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLAppDocElement;
}
export interface D2MetricCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLD2MetricElement;
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
    interface HTMLAppRootElement extends Components.AppRoot, HTMLStencilElement {
    }
    var HTMLAppRootElement: {
        prototype: HTMLAppRootElement;
        new (): HTMLAppRootElement;
    };
    interface HTMLD2IconElement extends Components.D2Icon, HTMLStencilElement {
    }
    var HTMLD2IconElement: {
        prototype: HTMLD2IconElement;
        new (): HTMLD2IconElement;
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
    interface HTMLD2RcardElement extends Components.D2Rcard, HTMLStencilElement {
    }
    var HTMLD2RcardElement: {
        prototype: HTMLD2RcardElement;
        new (): HTMLD2RcardElement;
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
        "app-root": HTMLAppRootElement;
        "d2-icon": HTMLD2IconElement;
        "d2-metric": HTMLD2MetricElement;
        "d2-metrics": HTMLD2MetricsElement;
        "d2-rcard": HTMLD2RcardElement;
        "d2-src-metadata": HTMLD2SrcMetadataElement;
        "d2-symthink-doc": HTMLD2SymthinkDocElement;
    }
}
declare namespace LocalJSX {
    interface AppDoc {
        "data"?: SymThink;
        "level"?: number;
        "onDocAction"?: (event: AppDocCustomEvent<{ action; value }>) => void;
    }
    interface AppRoot {
    }
    interface D2Icon {
        "expandable"?: boolean;
        "label"?: any;
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
    interface D2Rcard {
        "canEdit"?: boolean;
        "closeBtn"?: boolean;
        /**
          * Cannot pass this via html attribute. Data must be an object reference, so pass via JSX or Javascript.
         */
        "data"?: SymThinkDocument | SymThink1;
        "domrect"?: DOMRect;
        "notify"?: Subject<string>;
        "onDocAction"?: (event: D2RcardCustomEvent<{ action; value }>) => void;
        "onItemAction"?: (event: D2RcardCustomEvent<{ action; value; domrect?: DOMRect }>) => void;
        "reOrderDisabled"?: boolean;
    }
    interface D2SrcMetadata {
        "canEdit"?: boolean;
        "data"?: ISource;
        "index"?: number;
        "onItemAction"?: (event: D2SrcMetadataCustomEvent<{ action; value }>) => void;
    }
    interface D2SymthinkDoc {
        "data"?: SymThink1;
        "onDocAction"?: (event: D2SymthinkDocCustomEvent<{ action; value }>) => void;
    }
    interface IntrinsicElements {
        "app-doc": AppDoc;
        "app-root": AppRoot;
        "d2-icon": D2Icon;
        "d2-metric": D2Metric;
        "d2-metrics": D2Metrics;
        "d2-rcard": D2Rcard;
        "d2-src-metadata": D2SrcMetadata;
        "d2-symthink-doc": D2SymthinkDoc;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "app-doc": LocalJSX.AppDoc & JSXBase.HTMLAttributes<HTMLAppDocElement>;
            "app-root": LocalJSX.AppRoot & JSXBase.HTMLAttributes<HTMLAppRootElement>;
            "d2-icon": LocalJSX.D2Icon & JSXBase.HTMLAttributes<HTMLD2IconElement>;
            "d2-metric": LocalJSX.D2Metric & JSXBase.HTMLAttributes<HTMLD2MetricElement>;
            "d2-metrics": LocalJSX.D2Metrics & JSXBase.HTMLAttributes<HTMLD2MetricsElement>;
            "d2-rcard": LocalJSX.D2Rcard & JSXBase.HTMLAttributes<HTMLD2RcardElement>;
            "d2-src-metadata": LocalJSX.D2SrcMetadata & JSXBase.HTMLAttributes<HTMLD2SrcMetadataElement>;
            "d2-symthink-doc": LocalJSX.D2SymthinkDoc & JSXBase.HTMLAttributes<HTMLD2SymthinkDocElement>;
        }
    }
}
