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
    db.find(req.query).sort({ firstName: 1 }).exec(function (err, doc) {
        if (err) return console.log(err);
        res.json(doc);
    });
};

api.update = (req, res) => {
    if (!req.params.identifier)
        res.json({
            success: false,
            message: `parameter identifier can not be null`
        });

    db.update({ _id: req.params.identifier }, req.body, function (err, numReplaced) {
        if (err)
            res.json({
                success: false,
                message: err
            });

        if (numReplaced)
            res.status(200).json({
                success: true,
                message: `${req.params.identifier} success updated`
            });

        res.status(500).end({
            success: false,
            message: `can not find contact ${req.params.identifier}`
        });
    });
};

api.remove = (req, res) => {
    if (!req.params.identifier)
        res.json({
            success: false,
            message: `parameter identifier can not be null`
        });

    db.remove({ _id: req.params.identifier }, {}, function (err, numRemoved) {
        if (err)
            res.json({
                success: false,
                message: err
            });

        if (numRemoved)
            res.status(200).json({
                success: true,
                message: `${req.params.identifier} success removed`
            });

        res.status(500).end({
            success: false,
            message: `can not find contact ${req.params.identifier}`
        });
    });
};

api.search = (req, res) => {
    if (!req.params.identifier)
        res.json({
            success: false,
            message: `parameter identifier can not be null`
        });

    db.findOne({ _id: req.params.identifier }, function (err, doc) {
        if (err)
            res.json({
                success: false,
                message: err
            });

        if (!doc)
            res.json({
                success: false,
                message: `Contact can not be found. Maybe the identifier is wrong!`
            });

        res.json(doc);
    });
};

api.generate = (req, res) => {
    console.log(req.params.count)
    let count = (req.params.count==null ||req.params.count==undefined) ? 10 : req.params.count;

    db.remove({}, { multi: true });

    _.times(count, (index) => {
        let contact = {
            "firstName": faker.name.firstName(),
            "lastName": faker.name.lastName(),
            "email": faker.internet.email(),
            "gender": (index % 2 == 0) ? "m" : "f",
            "info": {
                "avatar": faker.internet.avatar(),
                "company": faker.company.companyName(),
                "address": faker.address.streetAddress(),
                "phone": faker.phone.phoneNumber(),
                "comments": faker.lorem.sentences()
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