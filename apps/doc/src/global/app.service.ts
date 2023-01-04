import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);


export type thkFileMetadata = {
    type: string,
    uid: string,
    fileName: string,
    metageneration: string,
    timeCreated: string,
    updated: string
    url?: string,
    dataUrl?: string,
    title?: string,
    descr?: string,
    author?: string
  };

class AppService {
    docMeta: thkFileMetadata;

    init() {
        console.log('Initializing doc app service');
        document.body.classList.add('body-doc');
    }

    setMetadata() {
        this.docMeta = window['META'];
    }

    /**
   * should match the min-width in media query used for 
   * "ion-content.pad-if-wide" in app.scss
   */
    get isWidescreen(): boolean {
        return window.innerWidth >= 600;
    }

    get created() {
        if (this.docMeta.timeCreated) {
            return dayjs(this.docMeta.timeCreated).format('MMMM D, YYYY');
        } else {
            return '';
        }
    }

    get updated() {
        if (this.docMeta.updated) {
            return dayjs(this.docMeta.updated).fromNow();
        } else {
            return '';
        }
    }

    get author() {
        if (this.docMeta.author) {
            return this.docMeta.author;
        } else {
            return '';
        }
    }

    hideSplashScreen() {
        const splashEl = document.querySelector('#splash-loading');
        if (splashEl) {
          document.body.removeChild(splashEl);
          document.body.classList.remove('splash-background');
        }
      }
}


export const AppSvc = new AppService();
