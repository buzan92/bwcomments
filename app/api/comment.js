'use strict';
import Comment from '../models/comment'
import { getCommentsByClientId } from '../controllers/comment'

export default router => {
    router
        .post('/api/getcomments/', getCommentsByClientIdApi)
//        .post('/api/client/', createClientApi)
//      .post('/categories', mw.verifyToken, create)
//      .get('/categories', allCategory)
//      .patch('/categories/:id', mw.verifyToken, modify)
//      .delete('/categories/:id', mw.verifyToken, deleteCat)
}

async function getCommentsByClientIdApi(ctx, next) {
    const { clientid } = ctx.request.body;
    let data = {},
        success = false;
    
    let comments = await getCommentsByClientId(clientid)
    if (comments) {
        success = true;
        data = comments;
    } 
    
    ctx.body = {
        success: success,
        data: data
    }
    await next();
}
/*
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
*/