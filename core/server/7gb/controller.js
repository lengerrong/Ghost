var debug = require('ghost-ignition').debug('7gb:controller'),
    _ = require('lodash'),
    path = require('path'),
    config = require('../config'),
    api = require('../api'),
    updateCheck = require('../update-check'),
    logging = require('../logging'),
    i18n = require('../i18n');

// Route: index
// Path: /7gb/
// Method: GET
module.exports = function adminController(req, res) {
    debug('index called');

    updateCheck().then(function then() {
        return updateCheck.showUpdateNotification();
    }).then(function then(updateVersion) {
        if (!updateVersion) {
            return;
        }

        var notification = {
            status: 'alert',
            type: 'info',
            location: 'upgrade.new-version-available',
            dismissible: false,
            message: i18n.t('notices.controllers.newVersionAvailable',
                {
                    version: updateVersion,
                    link: '<a href="https://docs.ghost.org/docs/upgrade" target="_blank">Click here</a>'
                })
        };

        return api.notifications.browse({context: {internal: true}}).then(function then(results) {
            if (!_.some(results.notifications, {message: notification.message})) {
                return api.notifications.add({notifications: [notification]}, {context: {internal: true}});
            }
        });
    }).finally(function noMatterWhat() {
        var defaultTemplate = 'default.html',
            templatePath = path.resolve(config.get('paths').gb7Views, defaultTemplate);
        res.sendFile(templatePath);
    }).catch(function (err) {
        logging.error(err);
    });
};
