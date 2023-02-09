# Next up in Monorepo

Critical Bugs:

5. Complete Drive UI integration

    * https://developers.google.com/drive/api/guides/enable-sdk


# Future features or improvements
* sharing a symthink, making public
    * https://developers.google.com/drive/api/guides/enable-shareddrives
    * https://developers.google.com/drive/api/guides/enable-sdk
* sources page; to display source url based on type and url metadata
* Option to query internet from a question.
    * Search options: tabs "My Lens", "Others", "Google"
        * My Lens, would search the domains of your Sources
        * Others, would require saving all sources to db with percentage of use.  Search by that.
* Do diff'ing of nodes based on node date comparisons if cloudLastMod is more recent than localLastMod
* COPPA or GDPR compliance: https://www.superawesome.com/a-guide-to-setting-up-google-analytics-for-kids-apps-and-sites/
* share option with shared pin to email or text recipients.  Enable editing among group, or just answering questions?
* improve use case for pic of artical to start and share symthink.
* use sentiment analysis score to determine if user can publish anonymously.
* Accept shared files: https://web.dev/web-share-target/#accepting-files
* future: alternatives to GDrive:
    * https://products.containerize.com/backup-and-sync/
    * https://hub.docker.com/r/pydio/cells/
* Fundraising platforms:
    * https://donorbox.org/integrations
* Firebase access token for G Drive only lasts 1 hour.  
    * A solution: https://inaguirre.medium.com/reusing-access-tokens-in-firebase-with-react-and-node-3fde1d48cbd3


# Refactoring

* consolidate class css .secondary-btn-theme 
* Any state props that don't need to be stored across sessions, should be moved to AppSvc
    * then can loop through all state props to save to storage onChange
* Instead of extending SymthinkDocument with a Persistence layer store, add the persistence store as a property. e.g.
    symthink.localStor
    symthink.remoteStor
* Consider using standard unicode characters for the Claim, Idea, Question symbolds instead of icomoon. See:
    * https://dn-works.com/wp-content/uploads/2023/UFAS010223/Symbola.pdf
    * https://www.fileformat.info/info/unicode/char/1f56b/browsertest.htm
    * https://www.fileformat.info/info/unicode/char/1f4a1/browsertest.htm


# Links

* https://github.com/bhagyas/app-urls
* https://www.timberlane.net/hs/files/Current-Issues-summer-work.pdf
* https://www-tc.pbs.org/now/classroom/acrobat/lesson05.pdf
* Funding sites: DonorBox, Patreon, GoFundMe, PayPal
* https://tobiasahlin.com/spinkit/
* https://icomoon.io/app/#/select
* https://iconscout.com/icon/gankyil-1536609
* https://developer.chrome.com/articles/url-protocol-handler/ - for PWAs
    * https://developer.mozilla.org/en-US/docs/Web/Manifest/protocol_handlers - browser support at bottom
* https://web.dev/customize-install/ - PWA Install experience
* https://developer.chrome.com/docs/ - Dev tools
* https://newsdata.io/blog/best-news-api/#:~:text=Mediastack%20is%20a%20free%2C%20simple,Global%20News%2C%20Made%20Easy - News APIs
