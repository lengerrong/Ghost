var debug = require('ghost-ignition').debug('7gb'),
    express = require('express'),

    // Global/shared middleware
    urlRedirects = require('../middleware/url-redirects'),
    errorHandler = require('../middleware/error-handler'),
    maintenance = require('../middleware/maintenance'),
    prettyURLs = require('../middleware/pretty-urls');

module.exports = function setup7GBApp() {
    debug('7GB setup start');
    var gb7App = express(),
        configMaxAge;

    // Render error page in case of maintenance
    gb7App.use(maintenance);

    // Force SSL if required
    // must happen AFTER asset loading and BEFORE routing
    gb7App.use(urlRedirects);

    // Add in all trailing slashes & remove uppercase
    // must happen AFTER asset loading and BEFORE routing
    gb7App.use(prettyURLs);

    // Finally, routing
    gb7App.get('*', require('./controller'));

    gb7App.use(errorHandler.pageNotFound);
    gb7App.use(errorHandler.handleHTMLResponse);

    debug('7GB setup end');

    return gb7App;
};
