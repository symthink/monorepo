'use strict'
const getHTML = require('html-get')

/**
 * `metascraper` is a collection of tiny packages,
 * so you can just use what you actually need.
 */
const metascraper = require('metascraper')([
    require('metascraper-author')(),
    require('metascraper-date')(),
    require('metascraper-logo')(),
    require('metascraper-publisher')(),
    require('metascraper-title')(),
    require('metascraper-url')(),
    require('metascraper-feed')(),
    require('metascraper-youtube')(),
    require('metascraper-amazon')(),
    require('metascraper-url')(),
    
]);


module.exports = async (event, context) => {
    // IEvent: body, headers, method, query, path
    let url;
    let output = 'citation scraper default output';
    if (event.method === 'GET' && event.query.url) {
        try {
            url = new URL(event.query.url);
            const browserless = require('browserless')();
            const getContent = async url => {
                const browserContext = browserless.createContext()
                const promise = getHTML(url, { getBrowserless: () => browserContext })
                promise.then(() => browserContext).then(browser => browser.destroyContext())
                return promise
            }
            const metadata = await getContent(url.toString())
                .then(metascraper)
                .then(md => {
                    browserless.close();
                    return md;
                });
            output = JSON.stringify(metadata);   
        }
        catch (e) {
            output = 'Invalid URL';
        }
    }
    else {
        output = 'Invalid HTTP Method; must use GET';
    }
    const result = {
        'body': output,
        'content-type': event.headers["content-type"]
    }

    return context
        .status(200)
        .succeed(result)
}