const api = require('../api');

module.exports = function (app) {

    app.route('/v1')
        .get(api.home);

    app.route('/v1/contacts')
        .post(api.insert)
        .get(api.list);

    app.route('/v1/contacts/:identifier')
        .delete(api.remove)
        .get(api.search)
        .put(api.update);

    app.route('/v1/generate/:count')
        .get(api.generate);

    app.all('*', (req, res) => {
        res.redirect('/v1');
    });
};