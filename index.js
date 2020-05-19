'use strict';

const serve = require('koa-static');
const route = require('koa-route');
const koa = require('koa');
const app = module.exports = new koa();
const donations = require('./controllers/donations.js');

app.use(serve('.'));

app.use(route.get('/', donations.index));
app.use(route.post('/donate', donations.donate));

app.listen(3000);
