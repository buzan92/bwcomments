'use strict';
import Koa from 'koa'
import config from  'config'
import err from './middleware/error'
import mongoose from 'mongoose'
import koaBody from 'koa-body'
import koaCors from 'koa2-cors'
import logger from 'koa-logger'
import serve from 'koa-static'
import socketio from 'socket.io'

import { bot, reply } from './telegrambot'

import router from './router'

mongoose.set('debug', true);
mongoose.connect(config.mongodb.url, config.mongodb.options);
mongoose.Promise = global.Promise;
mongoose.connection.on('error', console.error);

const app = new Koa();

app.use(serve(__dirname + '/public/photo'))
    .use(logger())
    .use(err)
    .use(koaBody())
    .use(koaCors({ credentials: true }))
    .use(router.routes())
    .use(router.allowedMethods())

var server = require('http').createServer(app.callback())
var io = require('socket.io')(server)
server.listen(config.server.port, "localhost")  

console.log(__dirname.slice(0, -3));
/*
app.listen(config.server.port, function () {
    console.log('%s listening at port %d', config.app.name, config.server.port);
});
*/

io.on('connection', function (socket) {
    console.log('node on connection fire');
    socket.emit('news', { hello: 'world' });
    socket.on('mevent', function (data) {
        const a = reply(data.content);
        console.log(data);
    });
});
