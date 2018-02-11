import Koa from 'koa'
import config from  'config'
import err from './middleware/error'
import mongoose from 'mongoose'
import koaBody from 'koa-body'
import logger from 'koa-logger'
import { bot } from './telegrambot'


//import { bittrex } from './controllers/bittrex';
//import { RSI } from './indicators/RSI';

import router from './router'

mongoose.set('debug', true);
mongoose.connect(config.mongodb.url, config.mongodb.options);
mongoose.Promise = global.Promise;
mongoose.connection.on('error', console.error);

const app = new Koa();
app.use(logger())
    .use(err)
    .use(koaBody())
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(config.server.port, function () {
    console.log('%s listening at port %d', config.app.name, config.server.port);
});