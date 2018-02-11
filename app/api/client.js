'use strict';
import Client from '../models/client'
import { getClient, createClient, getClientCount } from '../controllers/client'

export default router => {
    router
        .get('/api/client/', getClientApi)
        .post('/api/client/', createClientApi)
//      .post('/categories', mw.verifyToken, create)
//      .get('/categories', allCategory)
//      .patch('/categories/:id', mw.verifyToken, modify)
//      .delete('/categories/:id', mw.verifyToken, deleteCat)
}

async function getClientApi(ctx, next) {
    const { id } = ctx.request.query;
    let data = {},
        success = false;
    
    let client = await getClient(id)
    if (client) {
        success = true;
        data = client;
    } 

    ctx.body = {
        success: success,
        data: data
    }
    await next();
}

async function createClientApi(ctx, next) {
    const { orgname } = ctx.request.body;
    let success = false;
    let msg = 'Упс, произошла ошибка. Мы уже работаем над ней, попробуйте свой запрос позже';
    if (orgname) {
        let id = await getClientCount();
        let newClient = new Client({
            id: ++id,
            orgname: orgname,
            createdate: Date.now()
        });
        await newClient.save().catch(err => {
            throw new Error('error while add new client into db');
        });
        success = true;
        msg = 'Создание пользователя прошло успешно';
    }
    ctx.body = {
        success: success,
        message: msg
    }
}

/*
async function calcRsi(ctx, next) {
    const {market, periods, duration} = ctx.request.query;
    let data = '';
    if (market && periods && duration) {
        data = await RSI(market, periods, duration);
    } else {
        data = 'example query: ?market=BTC-XVG&periods=14&duration=30';
    }

    ctx.body = {
        data: data,
        query: ctx.request.query
    }
    await next();
}
*/