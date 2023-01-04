# To Do List

## MVP User Story

I want to be able to use SymThink on my phone while reading the paper, so that I can react to articals I'm reading.

### High-level Design Decisions for MVP v1

* No SymThink app installation in Drive.  CRUD all happens in app, although Deleting always possible in Drive.
* Sharing controlled by Drive.
* Will switch to Google Identity Platform by March 31, 2023 but not before Y-Combinator deadline.
* OAth2 scopes: will only request drive.file to avoid verification process.
* SymThink will create 'SymThink' folder and put all *.thk items in that folder.

## Next 3 specific things

1. complete the clip/paste feature
2. complete the delete feature
3. [bugfix] sometimes backspace to return to previous line does nothing.

## Next 3 Epics
    

1. https://github.com/firebase/functions-samples/blob/Node-8/authenticated-json-api/functions/index.js
2. Sharing with OG or Twitter cards
    * https://ogp.me
    * https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards
3. Set up Google Analytics

## Backlog

* [bug] title on localstorage list doesn't refresh after editing title
* cache google font for offline use, and/or fallback to other font
* re-opening arg, card type not setting properly
* after closing and re-opening some args, the learn-select buttons disappear.

* read-only view .. the same code maybe so that can leverage browser's built in QR code generator and sharing options.
* card://orphan
* https://symthink.io/arg/SOMEID
* add arg type in card header (e.g. syllogism, etc..)
    * change placeholder text based on selection
    * remove select caret if content exists
    * maybe adjust input lengths based on this selection
* add history prop for all cards
* dailyLimitExceededUnreg > show install button for adding app to google drive
* [bug] Refused to execute inline script because it violates the following Content Security Policy directive: "script-src 'self' https://apis.google.com". Either the 'unsafe-inline' keyword, a hash ('sha256-cJi8rffHlJ9/JUFZP0GKtGjusacqOUiFB9Z4dICXM1c='), or a nonce ('nonce-...') is required to enable inline execution.

## Epics

* Commenting: logical fallacies, cog bias
* As Me, I want easy to maintain code
* As User, I want critical thinking info when I need it most.
* As User, I want to be able to break off parts of tree and maybe attach elsewhere.
    * I want history of contributors to come with the branch.
* Move to Google Identity Platform by March 31, 2023, the deprecation date of the gapi toolkit
* I want a measure of integrity.  Could train an AI Model on card types.  See: https://cloud.google.com/natural-language/automl/docs/quickstart 



## Resources

* https://www.uspto.gov/trademarks/search/get-ready-search-classification-and-design#Classification%20find%20trademarks%20used%20on%20goods%20and%20services%20related%20to%20yours
* "Use in Commerce" - https://tmep.uspto.gov/RDMS/TMEP/current#/current/TMEP-900d1e7.html
* https://www.uspto.gov/trademarks/apply/intent-use-itu-applications#:~:text=You%20must%20file%20a%20Statement,unless%20they%20have%20been%20deleted.
* Application status: https://tsdr.uspto.gov/#caseNumber=97284129&caseSearchType=US_APPLICATION&caseType=DEFAULT&searchType=statusSearch
* https://cloud.google.com/natural-language/docs/analyzing-sentiment