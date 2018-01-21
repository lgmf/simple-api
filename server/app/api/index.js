const _ = require('lodash');
const faker = require('faker/locale/pt_BR')
const path = require('path');

let db = require('../../config/database');
let api = {}

api.home = (req, res) => {
    res.sendFile(path.join(`${__dirname}/index.html`));
}

api.insert = (req, res) => {
    let contact = req.body;

    if (!contact) return;

    delete contact._id;
    db.insert(contact, function (err, newDoc) {
        if (err) return console.log(err);
        console.log(`${newDoc._id} success written`);
        res.json(newDoc._id);
    });
};

api.list = (req, res) => {
    db.find(req.query).sort({ name: 1 }).exec(function (err, doc) {
        if (err) return console.log(err);
        res.json(doc);
    });
};

api.update = (req, res) => {
    if (!req.params._id) return;

    db.update({ _id: req.params._id }, req.body, function (err, numReplaced) {
        if (err) return console.log(err);
        if (numReplaced) res.status(200).end();
        res.status(500).end();
        console.log(`${req.params._id} success updated`);
        res.status(200).end();
    });
};

api.remove = (req, res) => {

    db.remove({ _id: req.params.fotoId }, {}, function (err, numRemoved) {
        if (err) return console.log(err);
        console.log('removido com sucesso');
        if (numRemoved) res.status(200).end();
        res.status(500).end();
    });
};

api.search = (req, res) => {
    if (!req.params.identifier) res.status(404).end();

    db.findOne({ _id: req.params.identifier }, function (err, doc) {
        if (err) return console.log(err);
        res.json(doc);
    });
};

api.generate = (req, res) => {
    let count = !req.params.count ? 10 : req.params.count;

    db.remove({}, { multi: true });

    _.times(count, (index) => {
        let contact = {
            "firstName": faker.name.firstName(),
            "lastName": faker.name.lastName(),
            "email": faker.internet.email(),
            "avatar": faker.internet.avatar(),
            "gender": (index % 2 == 0) ? "m" : "f",
            "info": {
                "company": faker.company.companyName()
            },
            "isFavorite": faker.random.boolean()
        }
        db.insert(contact, function (err, newDoc) {
            if (err) return console.log(err);
            console.log('Adicionado com sucesso: ' + newDoc._id);
        });
    });

    res.json({
        success: true,
        message: `${count} contacts inserted`
    });
}


module.exports = api;