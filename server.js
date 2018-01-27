var http = require('http')
    , app = require('./config/express')
db = require('./config/database');

const PORT = process.env.PORT || 3000

http.createServer(app).listen(PORT, function () {
    console.log('Servidor escutando na porta: ' + this.address().port);
});

