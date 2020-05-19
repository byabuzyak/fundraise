'use strict';

const views = require('co-views');
const parse = require('co-body');
const monk = require('monk');
const wrap = require('co-monk');
const db = monk('localhost/donation');
const donations = wrap(db.get('donations'));

let render = views(__dirname + '/../views', {
    map: {
        html: 'swig'
    }
});

module.exports.index = async function index(ctx) {
    ctx.body = await render('index');
};

module.exports.donate = async function donate(ctx) {
    let donation = await parse(ctx, {
        limit: '1kb'
    });

    let amount = parseInt(donation.amount);
    if (amount <= 0 || isNaN(amount) || -1 === ["USD", "EUR", "GBP", "RUB"].indexOf(donation.currency)) {
        ctx.body = JSON.stringify({ok: false});
        ctx.status = 400;

        return;
    }

    let result = donations.insert(donation);
    if (!result) {
        ctx.throw(400, "Donation couldn't be added");
    }

    ctx.body = JSON.stringify({ok: true});
    ctx.status = 201;
};
