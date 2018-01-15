var api = require('../api'),
    path = require('path');

module.exports  = function(app) {
    
    app.route('/v1/contacts')
        .post(api.adiciona)
        .get(api.lista);

    app.route('/v1/contacts/:identifier')
        .delete(api.remove)
        .get(api.busca)
        .put(api.atualiza);

    app.route('/v1/generate/:qtty')
       .post(api.generate)
               
    app.all('/*', function(req, res) {
        res.sendFile(path.join(app.get('clientPath'), 'index.html'));
    });
};